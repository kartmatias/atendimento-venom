import express from "express";
import database from "~/database"
import { auth, io } from "../../server";
const route = express.Router()

route.get('/', auth, async (request, response) => {
    const supports = await database.table('supports');
    response.status(200).json({ registers: supports });
})

route.get('/:id', auth, async ( request, response ) => {
    const support = await database.table('supports').where({ id: request.params.id });
    return response.status(200).json(support[0]);
})

route.put('/:id', auth, async ( request, response ) => {
    try {
        const { number, status, attendant } = request.body;
        
        const data = { number, status, attendant };

        const arraySupport = await database.table('supports').where({ id: request.params.id }).limit(1);
        const support = arraySupport[0];
        
        if ( support.status === data.status ) {
            return response.status(202).json({ updated: 0, message: `O Suporte já esta ${data.status}!` });
        }

        if ( support.status === "fechado" ){
            return response.status(202).json({ updated: 0, message: "Você não pode assumir um suporte já resolvido." });
        }

        const res = await database.table('supports').update(data).where({ id: request.params.id });
        io.emit('updateSupports', { updated: res });
        return response.status(200).json({ updated: res });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})


export default route;