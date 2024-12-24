import express from 'express';
const app = express();

app.get('/roads');
app.get('/centers');
app.get('/');
app.put('/roads/:road-idx/like');
app.put('/centers/:center-idx/like');
app.get('/roads/:road-idx');
app.get('/centers/:center-idx');
app.get('/search');
app.get('/position');
