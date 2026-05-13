<script setup>
import { ref, onMounted } from 'vue'

const pokemon = ref(null)
const busqueda = ref('')
const idActual = ref(1)

const buscarPokemon = async (query) => {
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
    if (!respuesta.ok) throw new Error('No encontrado')
    const data = await respuesta.json()
    pokemon.value = data
    idActual.value = data.id
    busqueda.value = ''
  } catch (error) {
    alert('Ese Pokémon no existe, compadre')
  }
}

const anterior = () => {
  if (idActual.value > 1) {
    buscarPokemon(idActual.value - 1)
  }
}

const siguiente = () => {
  buscarPokemon(idActual.value + 1)
}

const buscarEnInput = () => {
  if (busqueda.value) {
    buscarPokemon(busqueda.value.toLowerCase())
  }
}

onMounted(() => {
  buscarPokemon(idActual.value)
})
</script>

<template>
  <div class="tcg-container">
    <div v-if="pokemon" class="tcg-card">
      <div class="card-header">
        <span class="name">{{ pokemon.name.toUpperCase() }}</span>
        <span class="hp">
          HP {{ pokemon.stats[0].base_stat }} 
          <span class="type">{{ pokemon.types[0].type.name.toUpperCase() }}</span>
        </span>
      </div>
      
      <div class="image-box">
        <img :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" :alt="pokemon.name" />
      </div>

      <div class="pokedex-data">
        <span>NO. {{ pokemon.id }}</span>
        <span>HT: {{ pokemon.height / 10 }}m</span>
        <span>WT: {{ pokemon.weight / 10 }}kg</span>
      </div>

      <div class="attacks">
        <div class="attack" v-if="pokemon.moves[0]">
          <span class="energy">⏺️</span>
          <span class="attack-name">{{ pokemon.moves[0].move.name.replace('-', ' ').toUpperCase() }}</span>
          <span class="damage">{{ pokemon.stats[1].base_stat }}</span>
        </div>
        <div class="attack" v-if="pokemon.moves[1]">
          <span class="energy">⏺️⏺️</span>
          <span class="attack-name">{{ pokemon.moves[1].move.name.replace('-', ' ').toUpperCase() }}</span>
          <span class="damage">{{ Math.floor(pokemon.stats[1].base_stat * 1.5) }}</span>
        </div>
      </div>

      <div class="card-footer">
        <div><strong>Weakness</strong><br>x2</div>
        <div><strong>Resistance</strong><br>-</div>
        <div><strong>Retreat</strong><br>⭐⭐</div>
      </div>
    </div>
    
    <div class="controles">
      <button @click="anterior" :disabled="idActual <= 1">◀ Anterior</button>
      <input 
        v-model="busqueda" 
        @keyup.enter="buscarEnInput"
        placeholder="Nombre o ID" 
      />
      <button @click="siguiente">Siguiente ▶</button>
    </div>
  </div>
</template>

<style scoped>
.tcg-container {
  max-width: 360px;
  margin: 20px auto;
}

.tcg-card {
  background-color: #fbd743;
  border: 10px solid #fbd743;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 2px 5px 15px rgba(0, 0, 0, 0.4);
  font-family: 'Arial', sans-serif;
  color: #000;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding: 0 5px;
}

.name {
  font-weight: 900;
  font-size: 1.1rem;
}

.hp {
  color: #c0392b;
  font-weight: 900;
  font-size: 1.2rem;
}

.type {
  color: #333;
  font-size: 0.8rem;
  margin-left: 5px;
}

.image-box {
  background: radial-gradient(circle, #f0f0f0, #a0a0a0);
  border: 4px solid #8e9496;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 220px;
}

img {
  width: 90%;
  height: 90%;
  object-fit: contain;
  filter: drop-shadow(4px 4px 5px rgba(0, 0, 0, 0.5));
}

.pokedex-data {
  background: #d4a017;
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  justify-content: space-around;
  padding: 2px 0;
  margin: 5px 0;
  font-style: italic;
  border-radius: 2px;
}

.attacks {
  background: #fdfdfd;
  padding: 10px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 1px solid #ccc;
}

.attack {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.energy {
  font-size: 0.8rem;
}

.attack-name {
  font-weight: bold;
  flex-grow: 1;
  margin-left: 10px;
  font-size: 0.9rem;
}

.damage {
  font-weight: 900;
  font-size: 1.2rem;
}

.card-footer {
  display: flex;
  justify-content: space-around;
  text-align: center;
  font-size: 0.7rem;
  margin-top: 8px;
}

.controles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

input {
  padding: 10px;
  width: 100%;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-weight: bold;
}

button {
  padding: 10px 15px;
  background-color: #3b4cca;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
}

button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #2a3890;
}
</style>