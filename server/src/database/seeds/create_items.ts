import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('itens').insert([
        {
            title: 'Lampadas',
            image: 'lampada.svg'
        },
        {
            title: 'Pilhas e Bateria',
            image: 'bateria.svg'
        },
        {
            title: 'Papéis e Papelão',
            image: 'papal.svg'
        },
        {
            title: 'Resíduos Eletrônicos',
            image: 'eletronicos.svg'
        },
        {
            title: 'Resíduous Organicos',
            image: 'organicos.svg'
        },
        {
            title: 'Óleo de Cozinha',
            image: 'oleo.svg'
        }
    ]);
}
