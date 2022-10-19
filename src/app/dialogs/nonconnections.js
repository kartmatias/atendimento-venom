import database from "~/database";
import mime from "mime-types";
import { io } from '../../server';
import { ValidateCPF, getUserFromCPF } from "../../app/utils/ixc_functions";
import { UploadImage } from "../utils/fn"

class NonConnection
{
    async execute(client, message) {
        const _support = await database.table('supports').where({ number: message.from });
        const support = _support[0];

        if ( support.stage == 0 ) {
            const cpf = ValidateCPF(message.body);
            if ( !cpf )return client.sendText(message.from, "Por favor digite um CPF válido")
            
            const { registros } = await getUserFromCPF(cpf);
            if ( !registros )return client.sendText(message.from, "Não encontramos esse *CPF* em nossos banco de dados, verique o *CPF* digitado e tente novamente.");

            const cliente = registros[0];
            if ( !cliente )return client.sendText(message.from, "Não encontramos nenhum cadastro com o CPF digitado.");
            
            await database.table('supports').update({ stage: 1, client_id: cliente.id, name: message.sender.pushname, avatar_url: message.sender.profilePicThumbObj.eurl }).where({ number: message.from });
            client.sendText(message.from, "Siga o passo a passo:\n\n*1°* - Olhe atrás do seu roteador e veja se o cabo que vem da rua esta conectado no lugar correto, ou seja na porta WAN.\n\n*2°* - Desligue seu roteador da tomada, espere por 10 segundos e ligue-o novamente.\n\n*3°* - Veja se o nome do seu wifi esta aparecendo.\n\n*4°* - Veja se o roteador esta ligando.\n\n*5°* - Desligue o roteador da tomada espere por 20 segundos e ligue-o novamente.");
            client.sendText(message.from, "Após seguir o passo a passo selecione uma das opções:\n\n*1* - Agora estou com conexão\n*2* - Ainda estou sem conexão.");
        }

        else if ( support.stage == 1 ) {
            const option = parseInt(message.body);
            switch(option) {

                // voltou
                case 1: {
                    await database.table('supports').where({ number: message.from }).delete();
                    client.sendText(message.from, '💙 Que bom que resolvemos seu problema! 💙\n\nObrigado! Se precisar estaremos aqui para te ajudar.')
                    break;
                }

                // ainda sem internet
                case 2: {
                    // entrou no estagio 2
                    await database.table('supports').update({ status: "aberto", stage: 2 }).where({ number: message.from });

                    // pego alguns dados
                    const data = {
                        content: `${message.sender.pushname} abriu um chamado de sem conexão.`,
                        author: message.from,
                        support_id: support.id,
                    }
                    // registrar a mensagem no banco de dados.
                    await database.table('messages').insert(data);

                    // enviar a mensagem para todos os atendentes
                    io.emit("support.message", data);

                    client.sendText(message.from, "✅ Solicitação enviado com sucesso!\n\nPor favor aguarde um momento que em breve um atendente irá lhe atende-lo.");
                    break;
                }
            }
        }
        else if ( support.stage == 2 ) {
            if ( message.isMedia ) {
                
                // get timestamp
                const timestamp = new Date().getTime();
                const buffer = await client.decryptFile(message);
                const fileName = `${timestamp}-${support.id}.${mime.extension(message.mimetype)}`;
                
                // upar imagem
                UploadImage(fileName, buffer);

                // estrutura de dados
                const data = {
                    content: message.caption,
                    author: message.from,
                    support_id: support.id,
                    image: `/storages/${fileName}`
                }

                const arrInsertId = await database.table('messages').insert(data);
                const id = arrInsertId[0];
                if ( id ) {
                    io.emit('support.message', data);
                }
            } else {

                const data = {
                    content: message.body,
                    author: message.from,
                    support_id: support.id,
                }

                const arrInsertId = await database.table('messages').insert(data);
                const id = arrInsertId[0];
                if ( id ) {
                    io.emit('support.message', data);
                }                
            }
        }
    }
}
export default new NonConnection();