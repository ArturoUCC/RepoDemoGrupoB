// server/utils/db.js
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// Variable global para no abrir la base de datos múltiples veces
let conexionDB = null;

export const obtenerDB = async () => {
  if (!conexionDB) {
    conexionDB = await open({
      filename: './asisteprof.sqlite', // El archivo se creará en tu carpeta automáticamente
      driver: sqlite3.Database
    });

    // Crear tablas SQL si no existen (Cero POO, solo sentencias puras)
    await conexionDB.exec(`
      CREATE TABLE IF NOT EXISTS grupos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT);
      CREATE TABLE IF NOT EXISTS estudiantes (id INTEGER PRIMARY KEY AUTOINCREMENT, grupo_id INTEGER, nombre TEXT);
      CREATE TABLE IF NOT EXISTS asistencias (id INTEGER PRIMARY KEY AUTOINCREMENT, estudiante_id INTEGER, fecha TEXT, estado INTEGER);
    `);
  }
  return conexionDB;
};