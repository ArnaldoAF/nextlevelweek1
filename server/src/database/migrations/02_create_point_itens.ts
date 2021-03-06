import Knex from 'knex';

export async function up(knex: Knex) {
    //Criar a tabela
    return knex.schema.createTable('points_itens', table => {
        table.increments('id').primary();

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('itens');

        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');
        
    });
}

export async function down(knex: Knex) {
    //Deletear a tabela
    return knex.schema.dropTable('points_itens');
}