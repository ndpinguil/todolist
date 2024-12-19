const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // Importar el cliente PostgreSQL

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de PostgreSQL
const pool = new Pool({
    host: process.env.DATABASE_HOST || 'localhost', // Host de PostgreSQL
    user: process.env.DATABASE_USER || 'myuser', // Usuario de PostgreSQL
    password: process.env.DATABASE_PASSWORD || 'mypassword', // Contraseña de PostgreSQL
    database: process.env.DATABASE_NAME || 'mydatabase', // Nombre de la base de datos
    port: 5432, // Puerto de PostgreSQL
});

// Crear tabla si no existe
pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT false
    )
`, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err);
    } else {
        console.log('Tabla tasks lista');
    }
});

// Rutas
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/tasks', async (req, res) => {
    const { title, completed = false } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, completed) VALUES ($1, $2) RETURNING *',
            [title, completed]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Asegúrate de que 'completed' no sea null o undefined, y asigna un valor predeterminado (false) si es necesario.
    const finalCompleted = (completed === undefined || completed === null) ? false : completed;

    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
            [title, finalCompleted, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Servidor
app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});
