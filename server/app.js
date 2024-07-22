import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.resolve('client')));

app.get('/', (req, res, next) => {
  res.sendFile('index.html', { root: 'client' });
});

export default app;
