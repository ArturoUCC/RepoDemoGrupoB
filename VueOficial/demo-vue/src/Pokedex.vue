<script setup>
import { ref, onMounted } from 'vue'

const pokemones = ref([])
const cargando = ref(true)
const offset = ref(0)
const limit = 21

const cargarPokedex = async () => {
  cargando.value = true
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset.value}`)
    const data = await respuesta.json()
    
    const promesas = data.results.map(async (poke) => {
      const res = await fetch(poke.url)
      return res.json()
    })
    
    pokemones.value = await Promise.all(promesas)
  } catch (error) {
    alert('Hubo un error al cargar la Pokédex')
  } finally {
    cargando.value = false
  }
}

const paginaAnterior = () => {
  if (offset.value >= limit) {
    offset.value -= limit
    cargarPokedex()
  }
}

const paginaSiguiente = () => {
  offset.value += limit
  cargarPokedex()
}

onMounted(() => {
  cargarPokedex()
})
</script>

<template>
  <div class="pokedex-wrapper">
    <h1 class="titulo">Pokédex TCG</h1>
    
    <div class="paginacion">
      <button @click="paginaAnterior" :disabled="offset === 0 || cargando">◀ Anterior</button>
      <span>Página {{ (offset / limit) + 1 }}</span>
      <button @click="paginaSiguiente" :disabled="cargando">Siguiente ▶</button>
    </div>

    <div v-if="cargando" class="cargando">
      Cargando Pokémon...
    </div>

    <div v-else class="pokedex-grid">
      <div v-for="pokemon in pokemones" :key="pokemon.id" class="tcg-card">
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
    </div>

    <div class="paginacion" v-if="!cargando">
      <button @click="paginaAnterior" :disabled="offset === 0">◀ Anterior</button>
      <span>Página {{ (offset / limit) + 1 }}</span>
      <button @click="paginaSiguiente">Siguiente ▶</button>
    </div>
  </div>
</template>

<style scoped>
.pokedex-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.titulo {
  text-align: center;
  font-family: 'Arial', sans-serif;
  color: #3b4cca;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0px #ffcb05;
}

.paginacion {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  font-family: 'Arial', sans-serif;
}

.paginacion span {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

.paginacion button {
  padding: 10px 20px;
  background-color: #3b4cca;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.paginacion button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.paginacion button:hover:not(:disabled) {
  background-color: #2a3890;
}

.cargando {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #666;
  margin-top: 50px;
}

.pokedex-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  justify-items: center;
}

.tcg-card {
  width: 100%;
  max-width: 340px;
  background-color: #fbd743;
  border: 10px solid #fbd743;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 2px 5px 15px rgba(0, 0, 0, 0.4);
  font-family: 'Arial', sans-serif;
  color: #000;
  transition: transform 0.2s ease-in-out;
}

.tcg-card:hover {
  transform: translateY(-10px);
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
</style>