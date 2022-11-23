"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LeadSchema extends Schema {
  up() {
    this.create("leads", (table) => {
      table.increments();
      table.string("name", 200).notNullable();
      table.string("email", 254).notNullable().unique();
      table.string("phone", 60).notNullable();
      table.string("status", 20).notNullable();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("leads");
  }
}

module.exports = LeadSchema;
