// Imports
const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const users = require('./routes/users');
const login = require('./routes/login');
const mangas = require('./routes/mangas');
const scans = require('./routes/scans');
const selection = require('./routes/selection');
const stats = require('./routes/stats');
const upload = require('./routes/upload');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.static('client/build'));
app.use(cors({ origin: 'ttps://quiet-gorge-29705.herokuapp.com' }));

// Routes
app.use('/api/users', users)
app.use('/api/login', login)
app.use('/api/mangas', mangas)
app.use('/api/scans', scans)
app.use('/api/selection', selection);
app.use('/api/stats', stats);
app.use('/api/upload', upload);

app.get('/*', (_, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
})

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

const prod = `mongodb+srv://romain:romain@cluster0.p36bv.mongodb.net/nyscan?retryWrites=true&w=majority`;
const dev = 'mongodb://localhost/nyscan';

// DB Connection
mongoose.connect(prod)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB', err))