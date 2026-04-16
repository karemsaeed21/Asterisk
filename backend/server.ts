import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { admin } from './config/firebase-admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    firebase: admin ? 'initialized' : 'missing config'
  });
});

// Example route for Firebase Firestore
app.get('/api/data', async (req, res) => {
  try {
    // This is just a placeholder example
    // const snapshot = await admin.firestore().collection('items').get();
    res.json({ message: 'Firebase Admin is ready for Firestore operations.' });
  } catch (error) {
    res.status(500).json({ error: 'Firestore error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
