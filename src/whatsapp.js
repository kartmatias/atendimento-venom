import { create } from "venom-bot";
import database from "~/database";
import { io } from "./server";

create({ autoClose: 60000 * 60 }).then( async client => {

    // pegar mensagem do sistema do atendente
    io.on("connection", (socket) => {
        console.log(`- Usuário ${socket.id} conectado.`);
        socket.on('support.message', async ({ content, number, attendant_id, support_id }) => {
            try {
                const res = await client.sendText(number, content);
                if ( res ){
                    await database.table('messages').insert({ content, attendant_id, support_id });
                }
            } catch (error) {
                console.log(error);
            }
            
        })
    });
    

    client.onMessage( async message => {
        if ( !message.isGroupMsg ) {
            const support = await database.table('supports').where({ number: message.from });
            if ( !support.length ) {
                console.log("- inicio de atendimento.");
                await database.table('supports').insert({ number: message.from, dialog: "wellcome", stage: 0 });
                client.sendText(message.from, "Olá eu sou a *Márcia*, sua atendente virtual.\nSeja bem vindo(a) a central de atendimento da *codework Telecom!*");
                client.sendText(message.from, "Selecione uma das opções:\n\n*1* - Suporte Técnico\n*2* - Financeiro\n*3* - Comercial.\n*0* - Encerrar Atendimento.");
                return;
            }
            try {
                const dialogFileName = support[0].dialog;
                const { default: { execute } } = require(`./app/dialogs/${dialogFileName}`);
                execute(client, message);
            } catch (error) {
                console.log(error);
                client.sendText(message.from, "❌ Desculpe, mas não conseguimos processar seu pedido.\nO técnico responsável pela manutenção do auto-atendimento foi avisado e em breve o auto-atendimento voltará a funcionar.");
            }
        }
    })
}).catch( err => console.log(err));
