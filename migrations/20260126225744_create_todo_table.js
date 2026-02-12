/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('todo', function(table) {
    table.string('id').primary()
    table.string('user').notNullable().references('id').inTable('user').onDelete('CASCADE')
    table.string('title').notNullable()
    table.text('description')
    table.integer('done').defaultTo(0)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('todo')
};
