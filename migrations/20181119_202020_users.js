exports.up = knex => {
  return knex.schema.createTable("users", table => {
    table.uuid("id").primary();
    table.string("name");
    table.string("nickname").unique();
    table.string("email").unique();
    table.string("fb_id").unique();
    table.string("password").nullable();
    table.json("settings");
    table.json("demographics");
    table.timestamps(true, true);
    table.dateTime("deleted_at");
  });
};

exports.down = knex => {
  return knex.schema.dropTable("users");
};
