import express from 'express';
const app = express();

app.get('/mypages');
app.post('/mypages/profile');
app.get('/mypages/profile/list');
app.delete('/mypages/profile');
app.get('/mypages/roads/like-list');
app.get('/mypages/center/like-list');
