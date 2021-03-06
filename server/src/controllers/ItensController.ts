import { Request, Response } from 'express';
import knex from '../database/connections';


class ItensController{
    async index(request: Request, response: Response) {
        const itens = await knex('itens').select('*');
        const serializedItens = itens.map(item => {
            return {
                id: item.id,
                title: item.title,
                imageUrl: `http://localhost:3333/uploads/${item.image}`
            }
        });
    
        return response.json(serializedItens);
    }
}

export default ItensController;