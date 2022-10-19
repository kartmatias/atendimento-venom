
exports.up = function(knex) {
    return knex.schema.createTable('users', ( table ) => {
        table.increments('id')
        table.string('username', 64).unique().notNullable()
        table.string('password', 128).notNullable()
        table.string('avatar_url', 128)
        table.integer('supports_success').default(0).unsigned()
        table.float('rate').default(0).unsigned()
        table.timestamps()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
