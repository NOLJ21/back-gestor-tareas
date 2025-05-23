const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors({
  origin: 'https://front-gestor-tareas-j5th.vercel.app'
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tasks', require('./routes/task.routes'));

module.exports = app;
