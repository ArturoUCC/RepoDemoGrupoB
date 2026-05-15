<template>
  <div class="contenedor-principal">
    <div class="tarjeta">
      <h1 class="titulo">👋 ¡Hola Mundo!</h1>
      <p class="subtitulo">Bienvenido a mi proyecto portafolio en Nuxt 3.</p>
    </div>
  </div>
</template>

<style scoped>
.contenedor-principal {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  /* Fondo degradado con colores de Nuxt */
  background: linear-gradient(135deg, #00dc82, #36e4da);
  border-radius: 15px;
  margin: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.tarjeta {
  background: white;
  padding: 50px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.tarjeta:hover {
  transform: translateY(-5px); 
}

.titulo {
  color: #1a1a1a;
  font-size: 2.5rem;
  margin-top: 0;
  margin-bottom: 10px;
}

.subtitulo {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 0;
}
</style>