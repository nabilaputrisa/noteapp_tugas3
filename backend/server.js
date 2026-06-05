const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const notesRoutes = require('./routes/notes');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: '*',  // Izinkan semua origin (untuk local testing)
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/notes', notesRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Notes API berjalan',
        status: 'success',
        endpoints: {
            getAll: 'GET /api/notes',
            getById: 'GET /api/notes/:id',
            create: 'POST /api/notes',
            update: 'PUT /api/notes/:id',
            delete: 'DELETE /api/notes/:id'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        status: 'error'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something wrong',
        error: err.message,
        status: 'error'
    });
});

// Start server
app.listen(port, () => {
    console.log(`=================================`);
    console.log(`🚀 Server berjalan di:`);
    console.log(`   http://localhost:${port}`);
    console.log(`   http://localhost:${port}/api/notes`);
    console.log(`=================================`);
    console.log(`📝 Notes API is ready!`);
    console.log(`=================================`);
});

