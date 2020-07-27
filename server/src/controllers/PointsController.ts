import knex from '../database/connections';
import { Request, Response } from 'express';

class PointsController {
    async index(request: Request, response: Response) {
        //request.query;
        const {city, uf, itens} = request.query;

        const parsedItens = String(itens).split(',').map( item => Number(item.trim()));

        console.log(city, uf, parsedItens);

        const pointList = await knex('points')
                                .join('points_itens', 'points.id','=','points_itens.point_id')
                                .whereIn('points_itens.item_id', parsedItens)
                                .where('city',String(city))
                                .where('uf',String(uf))
                                .distinct()
                                .select('points.*')

        return response.json(pointList);
    }

    async show(request:Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message : "Point not found"});
        }

        const itens = await knex('itens')
                            .join('points_itens', 'itens.id','=','points_itens.item_id')
                            .where('points_itens.point_id', id)
                            .select('itens.title');

        
        return response.json({point, itens});
    };

    async create(request: Request, response: Response) {
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
 
        const point = {
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=60',
            email,
            name,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

       

        var pointItens = itens.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        });


        await trx('points_itens').insert(pointItens);

        await trx.commit()

        return response.json({
            id: point_id,
            ...point
        });
    }

}

export default PointsController;