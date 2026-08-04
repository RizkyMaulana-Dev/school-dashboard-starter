import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running smoothly!' });
});

// Penting untuk Vercel Serverless Function:
export default app;