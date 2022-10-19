// Update with your config settings.

module.exports = {

    development: {
      client: "mysql",
      connection: {
          host: process.env.MYSQL_HOST || "localhost",
          user: process.env.MYSQL_USER || "root",
          password: process.env.MYSQL_PASS || "S4p069@American",
          database: process.env.MYSQL_DATABASE || "codework"
      },
      migrations: {
          tableName: "codework_migrations",
          directory: `${__dirname}/src/database/migrations`
      }
    },
    production: {
      client: "mysql",
      connection: {
          host: process.env.MYSQL_HOST || "localhost",
          user: process.env.MYSQL_USER || "root",
          password: process.env.MYSQL_PASS,
          database: process.env.MYSQL_DATABASE || "codework"
      },
      migrations: {
          tableName: "codework_migrations",
          directory: `${__dirname}/src/database/migrations`
      }
    }
  
  };
  