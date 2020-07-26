import express, { response } from 'express';
import knex from './database/connections';
import { KnexTimeoutError } from 'knex';

const routes = express.Router();

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
    });

    return response.json(serializedItens);
})

routes.post('/points', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        itens
    } = request.body;

   const trx = await knex.transaction();

    const insertedIds = await trx('points').insert({
        image: 'image-fake',
        email,
        name,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
        
    });

    const point_id = insertedIds[0];

    var pointItens = itens.map((item_id: number) => {
        return {
            item_id,
            point_id
        }
    });
    console.log(point_id);
    console.log(pointItens);

    await trx('points_itens').insert(pointItens);

    return response.json({sucesses: true});
})

export default routes;