/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('todo_checklist', function(table) {
    table.string('id').primary()
    table.string('todo').notNullable().references('id').inTable('todo').onDelete('CASCADE')
    table.string('title').notNullable()
    table.integer('done').defaultTo(0)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('todo_checklist')
};
