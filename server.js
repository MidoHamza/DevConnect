const express = require('express');
const connectDB = require('./config/db');
// const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('hello world'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
