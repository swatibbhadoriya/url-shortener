const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/UrlRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/url', urlRoutes);

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync failed:', err));

module.exports = app;
