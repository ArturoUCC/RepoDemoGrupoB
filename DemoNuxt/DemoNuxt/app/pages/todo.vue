<template>
  <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px;">
    <h1>Mi Todo-List 📝</h1>

    <div style="margin-bottom: 20px;">
      <input 
        v-model.trim="nuevaTareaTexto" 
        placeholder="Escribe una nueva tarea..." 
        style="padding: 8px; width: 70%;"
        @keyup.enter="agregarTarea"
      />
      <button 
        @click="agregarTarea" 
        :disabled="!nuevaTareaTexto" 
        style="padding: 8px; margin-left: 5px;"
      >
        Agregar
      </button>
    </div>

    <ul style="list-style: none; padding: 0;">
      <li v-for="tarea in tareas" :key="tarea.id" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; display: flex; align-items: center; gap: 10px;">
        
        <input 
          type="checkbox" 
          :checked="tarea.realizada" 
          @change="(e) => modificarTarea(tarea.id, { realizada: e.target.checked })"
        />

        <span v-if="tareaEnEdicion !== tarea.id" :style="{ textDecoration: tarea.realizada ? 'line-through' : 'none', flexGrow: 1, opacity: tarea.realizada ? 0.5 : 1 }">
          {{ tarea.texto }}
        </span>
        <input 
          v-else 
          v-model.trim="textoEditado" 
          @keyup.enter="guardarEdicion(tarea.id)" 
          style="flex-grow: 1;"
        />

        <button @click="modificarTarea(tarea.id, { favorita: !tarea.favorita })">
          {{ tarea.favorita ? '⭐ Favorita' : '☆ Marcar Fav' }}
        </button>

        <button v-if="tareaEnEdicion !== tarea.id" @click="iniciarEdicion(tarea)">✏️ Editar</button>
        <button v-else @click="guardarEdicion(tarea.id)">💾 Guardar</button>

        <button @click="eliminarTarea(tarea.id)" style="color: red;">❌ Eliminar</button>
        
      </li>
    </ul>

    <p v-if="!tareas || tareas.length === 0" style="color: gray;">
      No hay tareas pendientes. ¡Agrega una nueva arriba!
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tareas = ref([])
const nuevaTareaTexto = ref('')
const tareaEnEdicion = ref(null)
const textoEditado = ref('')

// 1. Obtener tareas
const cargarTareas = async () => {
  const data = await $fetch('/api/todos')
  // Nos aseguramos de que siempre asigne un arreglo, incluso si falla la red
  tareas.value = Array.isArray(data) ? data : []
}

// Ejecutamos la carga inicial inmediatamente
cargarTareas()

// 2. Agregar tarea
const agregarTarea = async () => {
  // Doble validación para no crear tareas vacías
  if (!nuevaTareaTexto.value) return

  await $fetch('/api/todos', {
    method: 'POST',
    body: { texto: nuevaTareaTexto.value }
  })
  
  nuevaTareaTexto.value = ''
  await cargarTareas()
}

// 3. Modificar tarea (Toggles de Favorito y Realizada pasan por aquí)
const modificarTarea = async (id, cambios) => {
  await $fetch('/api/todos', {
    method: 'PUT',
    body: { id: id, ...cambios }
  })
  await cargarTareas()
}

// 4. Eliminar tarea
const eliminarTarea = async (id) => {
  await $fetch('/api/todos', {
    method: 'DELETE',
    body: { id: id }
  })
  await cargarTareas()
}

const iniciarEdicion = (tarea) => {
  tareaEnEdicion.value = tarea.id
  textoEditado.value = tarea.texto
}

const guardarEdicion = async (id) => {
  if (textoEditado.value) {
    await modificarTarea(id, { texto: textoEditado.value })
  }
  tareaEnEdicion.value = null
}
</script>