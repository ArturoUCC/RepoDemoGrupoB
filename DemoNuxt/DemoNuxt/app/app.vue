<template>
  <div>
    <nav style="background: #1a1a1a; padding: 15px; display: flex; gap: 20px; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <NuxtLink to="/" class="nav-link">
        🏠 Hola Mundo
      </NuxtLink>
      
      <NuxtLink to="/todo" class="nav-link">
        📝 Todo-List
      </NuxtLink>
      
      <NuxtLink to="/asisteprof" class="nav-link">
        🏫 AsisteProf
      </NuxtLink>
    </nav>
    
    <NuxtPage />
  </div>
</template>

<style>
/* Estilo general del fondo */
body {
  margin: 0;
  background-color: #f8f9fa;
}

/* Estilo base para todos los enlaces del menú */
.nav-link {
  color: white; /* Por defecto todos son blancos */
  text-decoration: none;
  font-weight: bold;
  font-family: sans-serif;
  padding: 5px 10px;
  border-radius: 5px;
  transition: color 0.3s;
}

/* ¡La magia de Nuxt! Esta clase se activa sola en la página actual */
.router-link-exact-active {
  color: #00dc82; 
}
</style>