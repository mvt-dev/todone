/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('todo', function(table) {
    table.string('time')
    table.integer('order').defaultTo(0)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('todo', function(table) {
    table.dropColumn('time')
    table.dropColumn('order')
  })
};
