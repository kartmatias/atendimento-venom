
exports.up = function(knex) {
    return knex.schema.createTable('supports', (table) => {
        table.increments('id');
        table.string('name', 64);
        table.string('avatar_url', 1024);
        table.string('number');
        table.integer('attendant', 11).unsigned();
        table.string('client_id');
        table.string('subject', 128);
        table.string('dialog');
        table.integer('stage', 2).unsigned();
        table.enum('status', [ 'aberto', 'fechado', 'em progresso' ]);
        table.timestamps();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('supports');
};
