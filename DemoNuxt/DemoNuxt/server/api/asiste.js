// server/api/asiste.js
import { obtenerDB } from '../utils/db.js'

export default defineEventHandler(async (event) => {
  const db = await obtenerDB();
  const metodo = event.node.req.method;

  // RUTAS GET (Leer datos)
  if (metodo === 'GET') {
    const query = getQuery(event);
    
    if (query.accion === 'grupos') return await db.all('SELECT * FROM grupos');
    
    if (query.accion === 'estudiantes') {
      return await db.all('SELECT * FROM estudiantes WHERE grupo_id = ?', [query.grupo_id]);
    }

    if (query.accion === 'dashboard') {
      // Modificamos para cruzar las tablas y poder filtrar por grupo_id si se envía
      let sqlPresentes = 'SELECT COUNT(*) as total FROM asistencias a JOIN estudiantes e ON a.estudiante_id = e.id WHERE a.estado = 1';
      let sqlFaltas = 'SELECT COUNT(*) as total FROM asistencias a JOIN estudiantes e ON a.estudiante_id = e.id WHERE a.estado = 0';
      let parametros = [];

      if (query.grupo_id) {
        sqlPresentes += ' AND e.grupo_id = ?';
        sqlFaltas += ' AND e.grupo_id = ?';
        parametros.push(query.grupo_id);
      }

      const totalAsistencias = await db.get(sqlPresentes, parametros);
      const totalFaltas = await db.get(sqlFaltas, parametros);
      return { presentes: totalAsistencias.total, faltas: totalFaltas.total };
    }

    if (query.accion === 'historial') {
      let sql = `
        SELECT a.id, a.fecha, a.estado, e.nombre AS estudiante, g.nombre AS grupo
        FROM asistencias a
        JOIN estudiantes e ON a.estudiante_id = e.id
        JOIN grupos g ON e.grupo_id = g.id
      `;
      let parametros = [];

      // Si nos envían un grupo_id, filtramos la tabla
      if (query.grupo_id) {
        sql += ' WHERE g.id = ?';
        parametros.push(query.grupo_id);
      }

      sql += ' ORDER BY a.fecha DESC';
      return await db.all(sql, parametros);
    }
  }

  // RUTAS POST (Guardar datos)
  if (metodo === 'POST') {
    const body = await readBody(event);

    if (body.accion === 'crear_grupo') {
      const resultado = await db.run('INSERT INTO grupos (nombre) VALUES (?)', [body.nombre]);
      return { id: resultado.lastID };
    }

    if (body.accion === 'agregar_estudiante') {
      const resultado = await db.run('INSERT INTO estudiantes (grupo_id, nombre) VALUES (?, ?)', [body.grupo_id, body.nombre]);
      return { id: resultado.lastID };
    }

    if (body.accion === 'guardar_lista') {
      for (const registro of body.asistencias) {
        await db.run(
          'INSERT INTO asistencias (estudiante_id, fecha, estado) VALUES (?, ?, ?)',
          [registro.estudiante_id, body.fecha, registro.estado ? 1 : 0]
        );
      }
      return { mensaje: 'Asistencia guardada' };
    }
  }
});