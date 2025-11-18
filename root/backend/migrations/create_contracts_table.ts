import type { Knex } from 'knex';

// This function runs when you "migrate"
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('contracts', (table: Knex.CreateTableBuilder) => {
    table.string('id').primary(); // The unique ID
    table.string('partyName').notNullable();
    table.string('contractType').notNullable();
    table.string('status').notNullable();
    table.string('fileName').notNullable();
    table.timestamp('uploadedAt').defaultTo(knex.fn.now()); // Automatically set the upload time
  });
}

// This function runs if you ever need to "undo" the migration
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('contracts');
}