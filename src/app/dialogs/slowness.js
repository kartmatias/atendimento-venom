import database from '~/database';
import { getUserFromCPF, ValidateCPF } from "../utils/ixc_functions";
import { UploadImage } from "../utils/fn";
import mime from "mime-types"

class Slowness
{
    async execute(client, message) {
        const supports = await database.table('supports').where({ number: message.from });
        const support = supports[0];
        
        if ( support.stage == 0 ){
            await database.table('supports').update({ stage: 1 }).where({ number: message.from });
            const cpf = ValidateCPF(message.body);
            if ( !cpf )return client.sendText(message.from, "Por favor digite um CPF válido")
            
            const { registros } = await getUserFromCPF(cpf);
            if ( !registros )return client.sendText(message.from, "Não encontramos esse *CPF* em nossos banco de dados, verique o *CPF* digitado e tente novamente.");

            const cliente = registros[0];
            if ( !cliente )return client.sendText(message.from, "Não encontramos nenhum cadastro com o CPF digitado.");
            
            client.sendText(message.from, "Siga o Passo a Passo:\n\n*1°* Desconecte todos os dispositivos do seu roteador.\n\n*2°* Faça um teste de velocidade em https://codeworktelecom.net.br/safety/\n\n*3°* Assim que o teste terminar nos envia uma print do resultado.");
        }
        else if ( support.stage == 1 ) {
            if ( !message.isMedia ) {
                client.sendText(message.from, "Por favor nos envie uma foto do teste de velocidade.");
                return;
            }
            // get timestamp
            const timestamp = new Date().getTime();
            const buffer = await client.decryptFile(message);
            const fileName = `${timestamp}-${support.id}.${mime.extension(message.mimetype)}`;
            UploadImage(fileName, buffer);
            await database.table('messages').insert({ content: message.caption, image: `/storages/${fileName}`, support_id: 3, status: "aberto" });
        }
    }
}
export default new Slowness();