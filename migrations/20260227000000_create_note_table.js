/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('note', function(table) {
      table.string('id').primary()
      table.string('user').notNullable().references('id').inTable('user').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description')
      table.integer('order').defaultTo(0)
    })
    .createTable('note_checklist', function(table) {
      table.string('id').primary()
      table.string('note').notNullable().references('id').inTable('note').onDelete('CASCADE')
      table.string('title').notNullable()
      table.boolean('done').defaultTo(false)
      table.integer('order').defaultTo(0)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('note_checklist').dropTable('note')
};
