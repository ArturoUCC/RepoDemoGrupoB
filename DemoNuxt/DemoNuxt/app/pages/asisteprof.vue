<template>
  <div style="font-family: sans-serif; max-width: 800px; margin: 20px auto; padding: 20px;">
    <h1>AsisteProf 🏫</h1>
    
    <div style="margin-bottom: 20px; border-bottom: 2px solid #ccc; padding-bottom: 10px;">
      <button @click="vistaActual = 'dash'" style="margin-right: 10px;">📊 Dashboard</button>
      <button @click="vistaActual = 'grupos'" style="margin-right: 10px;">👥 Grupos y Alumnos</button>
      <button @click="vistaActual = 'lista'">📋 Pase de Lista</button>
    </div>

    <div v-if="vistaActual === 'dash'">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>Estadísticas Generales</h2>
        <button @click="cargarEstadisticas" style="padding: 8px; cursor: pointer;">Actualizar Datos</button>
      </div>
      
      <div style="margin-top: 10px; background: #f0f4f8; padding: 15px; border-radius: 8px; border: 1px solid #dce4ec;">
        <label style="font-weight: bold; margin-right: 10px;">Filtro de visualización:</label>
        <select v-model="grupoFiltroDashboard" @change="cargarEstadisticas" style="padding: 5px; min-width: 200px;">
          <option value="">Todos los grupos</option>
          <option v-for="grupo in grupos" :key="grupo.id" :value="grupo.id">
            {{ grupo.nombre }}
          </option>
        </select>
      </div>
      
      <div style="display: flex; gap: 20px; margin-top: 20px;">
        <div style="padding: 20px; background: #e0f7fa; border-radius: 8px; flex: 1;">
          <h3 style="margin: 0;">Asistencias Totales</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0 0 0; color: #00796b;">{{ estadisticas.presentes }}</p>
        </div>
        <div style="padding: 20px; background: #ffebee; border-radius: 8px; flex: 1;">
          <h3 style="margin: 0;">Faltas Totales</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0 0 0; color: #c62828;">{{ estadisticas.faltas }}</p>
        </div>
      </div>

      <div style="margin-top: 40px;">
        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">📋 Detalle de Alumnos</h3>
        
        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #ccc; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead style="background: #f8f9fa; position: sticky; top: 0;">
              <tr>
                <th style="padding: 12px; border-bottom: 2px solid #ddd;">Fecha</th>
                <th style="padding: 12px; border-bottom: 2px solid #ddd;">Grupo</th>
                <th style="padding: 12px; border-bottom: 2px solid #ddd;">Alumno</th>
                <th style="padding: 12px; border-bottom: 2px solid #ddd;">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="registro in historialAsistencias" :key="registro.id" style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px;">{{ registro.fecha }}</td>
                <td style="padding: 12px;"><strong>{{ registro.grupo }}</strong></td>
                <td style="padding: 12px;">{{ registro.estudiante }}</td>
                <td style="padding: 12px;">
                  <span v-if="registro.estado === 1" style="color: #2e7d32; font-weight: bold; background: #e8f5e9; padding: 4px 8px; border-radius: 12px; font-size: 0.9em;">✔️ Presente</span>
                  <span v-else style="color: #c62828; font-weight: bold; background: #ffebee; padding: 4px 8px; border-radius: 12px; font-size: 0.9em;">❌ Falta</span>
                </td>
              </tr>
              <tr v-if="historialAsistencias.length === 0">
                <td colspan="4" style="padding: 20px; text-align: center; color: #666;">No hay registros para mostrar.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="vistaActual === 'grupos'">
      <h2>Gestión de Aulas</h2>
      <input v-model.trim="nuevoGrupo" placeholder="Nombre del Grupo (ej. 3-A)" />
      <button @click="crearGrupo">Crear Grupo</button>

      <div style="margin-top: 20px; display: flex; gap: 20px;">
        <ul style="flex: 1; border: 1px solid #ccc; padding: 10px; list-style: none;">
          <li v-for="grupo in grupos" :key="grupo.id" 
              @click="seleccionarGrupo(grupo)"
              style="cursor: pointer; padding: 5px; margin-bottom: 5px; background: #eee;">
            📁 {{ grupo.nombre }}
          </li>
        </ul>

        <div style="flex: 1; border: 1px solid #ccc; padding: 10px;" v-if="grupoSeleccionado">
          <h3>Alumnos de: {{ grupoSeleccionado.nombre }}</h3>
          <input v-model.trim="nuevoEstudiante" placeholder="Nombre del alumno" />
          <button @click="agregarEstudiante">Añadir</button>
          
          <ul style="margin-top: 10px;">
            <li v-for="estudiante in estudiantes" :key="estudiante.id">{{ estudiante.nombre }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="vistaActual === 'lista'">
      <h2>Pase de Lista</h2>
      
      <select v-model="grupoParaLista" @change="cargarListaEstudiantes" style="padding: 5px;">
        <option disabled value="">Selecciona un Grupo...</option>
        <option v-for="grupo in grupos" :key="grupo.id" :value="grupo">{{ grupo.nombre }}</option>
      </select>
      
      <input type="date" v-model="fechaLista" style="margin-left: 10px; padding: 5px;" />

      <div v-if="estudiantesLista.length > 0" style="margin-top: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #333; color: white;">
            <th style="padding: 10px; text-align: left;">Alumno</th>
            <th style="padding: 10px;">¿Presente?</th>
          </tr>
          <tr v-for="(estudiante, index) in estudiantesLista" :key="estudiante.id" style="border-bottom: 1px solid #ccc;">
            <td style="padding: 10px;">{{ estudiante.nombre }}</td>
            <td style="padding: 10px; text-align: center;">
              <input type="checkbox" v-model="asistenciaEstado[index]" style="transform: scale(1.5);" />
            </td>
          </tr>
        </table>
        
        <button @click="guardarPaseDeLista" style="margin-top: 20px; padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer;">
          💾 Guardar Asistencia
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// --- ESTADO GENERAL ---
const vistaActual = ref('dash')
const grupos = ref([])

// --- ESTADO DASHBOARD ---
const estadisticas = ref({ presentes: 0, faltas: 0 })
const historialAsistencias = ref([])
const grupoFiltroDashboard = ref('') // <-- NUEVA VARIABLE PARA EL FILTRO

// --- ESTADO GRUPOS ---
const nuevoGrupo = ref('')
const nuevoEstudiante = ref('')
const grupoSeleccionado = ref(null)
const estudiantes = ref([])

// --- ESTADO LISTA ---
const grupoParaLista = ref('')
const fechaLista = ref(new Date().toISOString().split('T')[0]) 
const estudiantesLista = ref([])
const asistenciaEstado = ref([])

// --- FUNCIONES ---

const cargarGrupos = async () => {
  grupos.value = await $fetch('/api/asiste?accion=grupos')
}

// Cargar estadísticas AHORA incluye el filtro
const cargarEstadisticas = async () => {
  // Construimos la URL dependiendo de si hay un grupo seleccionado o no
  const parametros = grupoFiltroDashboard.value ? `&grupo_id=${grupoFiltroDashboard.value}` : ''
  
  estadisticas.value = await $fetch(`/api/asiste?accion=dashboard${parametros}`)
  historialAsistencias.value = await $fetch(`/api/asiste?accion=historial${parametros}`)
}

// Lógica de Grupos y Alumnos
const crearGrupo = async () => {
  if (!nuevoGrupo.value) return
  await $fetch('/api/asiste', { method: 'POST', body: { accion: 'crear_grupo', nombre: nuevoGrupo.value }})
  nuevoGrupo.value = ''
  await cargarGrupos()
}

const seleccionarGrupo = async (grupo) => {
  grupoSeleccionado.value = grupo
  estudiantes.value = await $fetch(`/api/asiste?accion=estudiantes&grupo_id=${grupo.id}`)
}

const agregarEstudiante = async () => {
  if (!nuevoEstudiante.value || !grupoSeleccionado.value) return
  await $fetch('/api/asiste', { 
    method: 'POST', 
    body: { accion: 'agregar_estudiante', grupo_id: grupoSeleccionado.value.id, nombre: nuevoEstudiante.value }
  })
  nuevoEstudiante.value = ''
  await seleccionarGrupo(grupoSeleccionado.value)
}

// Lógica del Pase de Lista
const cargarListaEstudiantes = async () => {
  if (!grupoParaLista.value) return
  estudiantesLista.value = await $fetch(`/api/asiste?accion=estudiantes&grupo_id=${grupoParaLista.value.id}`)
  asistenciaEstado.value = estudiantesLista.value.map(() => true) 
}

const guardarPaseDeLista = async () => {
  const registros = estudiantesLista.value.map((estudiante, index) => ({
    estudiante_id: estudiante.id,
    estado: asistenciaEstado.value[index] ? 1 : 0 
  }))

  await $fetch('/api/asiste', {
    method: 'POST',
    body: { accion: 'guardar_lista', fecha: fechaLista.value, asistencias: registros }
  })
  
  alert('¡Asistencia guardada correctamente en la base de datos local!')
  estudiantesLista.value = [] 
  grupoParaLista.value = ''
  await cargarEstadisticas() 
}

// Carga inicial
onMounted(() => {
  cargarGrupos()
  cargarEstadisticas()
})
</script>