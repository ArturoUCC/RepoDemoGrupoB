// server/api/todos.js

// Almacenamiento en memoria usando un simple arreglo
let tareas = [];
let siguienteId = 1;

export default defineEventHandler(async (event) => {
  // Obtenemos qué tipo de petición nos hace el Front-end
  const metodo = event.node.req.method;

  // LEER: Devuelve el arreglo de tareas
  if (metodo === 'GET') {
    return tareas;
  }

  // CREAR: Agrega un nuevo objeto plano al arreglo
  if (metodo === 'POST') {
    const body = await readBody(event);
    const nuevaTarea = {
      id: siguienteId++,
      texto: body.texto,
      realizada: false,
      favorita: false
    };
    tareas.push(nuevaTarea);
    return nuevaTarea;
  }

  // MODIFICAR: Actualiza una tarea buscando su posición en el arreglo
  if (metodo === 'PUT') {
    const body = await readBody(event);
    const indice = tareas.findIndex(tarea => tarea.id === body.id);
    
    if (indice !== -1) {
      // Usamos el operador spread (...) de JS para mezclar los datos
      tareas[indice] = { ...tareas[indice], ...body };
      return tareas[indice];
    }
  }

  // ELIMINAR: Filtra el arreglo para quitar la tarea
  if (metodo === 'DELETE') {
    const body = await readBody(event);
    tareas = tareas.filter(tarea => tarea.id !== body.id);
    return { mensaje: 'Tarea eliminada' };
  }
});