<script setup>
import { ref } from 'vue'

// Creamos una referencia reactiva (un simple estado)
const contador = ref(0)

// Funciones flecha sencillas para la lógica
const incrementar = () => {
  contador.value++
}

const decrementar = () => {
  contador.value--
}
</script>

<template>
  <div class="contador-caja">
    <h2>Valor actual: {{ contador }}</h2>
    
    <button @click="incrementar">Incrementar</button>
    <button @click="decrementar">Decrementar</button>
  </div>
</template>

<style scoped>
.contador-caja {
  border: 2px solid #42b883;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 10px;
}

button {
  background-color: #35495e;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #42b883;
}
</style>