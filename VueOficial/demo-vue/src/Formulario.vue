<script setup>
import { ref } from 'vue'

// Creamos las variables reactivas vacías
const nombre = ref('')
const email = ref('')
</script>

<template>
  <div class="contenedor-form">
    <h3>Registro de Usuario</h3>
    
    <div class="inputs">
      <input 
        v-model="nombre" 
        type="text" 
        placeholder="Escribe tu nombre"
      />
      
      <input 
        v-model="email" 
        type="email" 
        placeholder="Escribe tu correo"
      />
    </div>

    <div class="preview">
      <h4>Datos en tiempo real:</h4>
      <p><strong>Tu nombre es:</strong> {{ nombre }}</p>
      <p><strong>Tu correo es:</strong> {{ email }}</p>
    </div>
  </div>
</template>

<style scoped>
.contenedor-form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-family: sans-serif;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.preview {
  background-color: #f9f9f9;
  padding: 15px;
  border-left: 5px solid #42b883;
}

h4 {
  margin-top: 0;
  color: #42b883;
}
</style>