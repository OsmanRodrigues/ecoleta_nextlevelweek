import express from 'express';

const app = express();

app.get('/users', (resquest, response)=>{
    console.log('Listagem de usuários')

    response.json([
        'Osman',
        'Carlos',
        'Luiza',
        'Pedro'
    ]);
});

app.listen(3333);

