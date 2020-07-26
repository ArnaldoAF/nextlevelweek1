import knex from '../database/connections';
import { Request, Response } from 'express';

class PointsController {
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
            image: 'image-fake',
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



        return response.json({
            id: point_id,
            ...point
        });
    }

}

export default PointsController;