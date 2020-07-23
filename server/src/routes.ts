import express, { response } from 'express';
import knex from './database/connections';

const routes = express.Router();

routes.get('/users', (request, response) => {
    return response.json({ message: "Hello World" })
});

routes.get('/hi', (request, response) => {
    return response.json({ message: "Tudo Ok" })
});

routes.get('/itens', async (request, response) => {
    const itens = await knex('itens').select('*');

    const serializedItens = itens.map(item => {
        return {
            id: item.id,
            title: item.title,
            imageUrl: `http://localhost:3333/uploads/${item.image}`

        }
    })

    return response.json(serializedItens);
})

export default routes;