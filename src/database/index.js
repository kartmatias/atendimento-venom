import knex from "knex";
import knexfile from "../../knexfile";
const stage = process.env.STAGE;
export default knex(knexfile[stage]);
