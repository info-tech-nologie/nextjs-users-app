// lib/db.ts
import { Pool } from 'pg';

// Crée une instance de pool de connexion à la base de données PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Fonction pour insérer un utilisateur dans la base de données
export async function insertUser(name: string, email: string, imageUrl: string) {
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, email, imageUrl]
    );
    return result.rows[0]; // Retourne l'utilisateur inséré
  } catch (error) {
    console.error('Erreur d\'insertion dans la DB', error);
    throw error;
  }
}

// Fonction pour récupérer tous les utilisateurs
export async function getUsers() {
  try {
    const result = await pool.query('SELECT * FROM users');
    return result.rows; // Retourne la liste des utilisateurs
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs', error);
    throw error;
  }
}
