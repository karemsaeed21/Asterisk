import dotenv from 'dotenv';
// Load environment variables immediately before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import { supabase } from './config/supabase.js';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// API Status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    database: supabase ? 'initialized' : 'missing config'
  });
});

// Database Diagnostic Endpoint
app.get('/api/db-check', async (req, res) => {
    try {
        const { count: userCount, error: userError } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: roomCount, error: roomError } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
        
        if (userError || roomError) throw userError || roomError;

        res.json({
            status: 'connected',
            users: userCount,
            rooms: roomCount,
            message: 'Supabase connection is healthy and data is present.'
        });
    } catch (err: any) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
