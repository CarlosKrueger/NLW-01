import Knex from 'knex'

export async function up(knex: Knex) {
    return knex.schema.createTable('ecopoint_items', table => {
        table.increments('id').primary();
        table.integer('ecopoint_id')
        .notNullable()
        .references('id')
        .inTable('ecopoint');
        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('item');
    });
};

export async function down(knex: Knex) {
    return knex.schema.dropTable('ecopoint_items');
};