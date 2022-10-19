import express, { request } from "express";
import database from "~/database"
import { io } from "../../server"
const route = express.Router()

route.get('/', async (request, response) => {
    const messages = await database.table('messages');
    response.status(200).json({ registers: messages });
});

route.get('/support/:id', async ( request, response ) => {
    const { id } = request.params;
    const messages = await database.select('*').from('messages').where({ support_id: id });
    return response.status(200).json({ registers: messages });
});

route.post('/', async (request, response) => {
    try {
        const { author, content, attendant_id, support_id } = request.body;
        
        const _supports = await database.table('supports').where({ id: support_id });
        const support = _supports[0];
        
        if ( !support )return response.status(400).json({ error: "Não encontramos o suporte informado, verifique o dado digitado." });

        if ( support.status === "fechado")return response.status(403).json({ error: "O Suporte se encontra fechado e é impossível enviar mensagem." });

        const _messageID = await database.table('messages').insert({ author, content, attendant_id, support_id })
        const messageId = _messageID[0];
        if ( !messageId )return response.status(202).json({ error: "Mensagem não foi criada." });

        const _message = await database.table('messages').where({ id: messageId });
        const message = _message[0];
        return response.status(201).json(message);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: "Verifique os dados digitados e tente novamente", errorCode: error.code })
    }
    
})

export default route;