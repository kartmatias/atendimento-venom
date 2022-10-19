
exports.up = function(knex) {
    return knex.schema.createTable('messages', ( table ) => {
        table.increments();
        table.integer('support_id', 11).notNullable().unsigned();
        table.text('content').notNullable();
        table.string('image', 1024).defaultTo(null)
        table.string('author')
        table.integer('attendant_id').unsigned();
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('messages');
};
