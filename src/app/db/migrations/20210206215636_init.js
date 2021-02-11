exports.up = function (knex) {
  return knex.schema.createTable("messages", function (table) {
    table.increments();
    table.string("subject");
    table.string("senderName");
    table.string("senderEmail");
    table.string("compressedRtf");
    table.string("headers");
    table.string("body");
    table.json("recipients").defaultTo([]);
    table.json("attachments").defaultTo([]);
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("messages");
};
