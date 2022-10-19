import database from '~/database';
import ixc from '../utils/ixc_functions'

class SupportTech
{
    async execute(client, message) {
        const options = parseInt(message.body);
        switch(options) {

            // sem conexão
            case 1: {
                await database.table('supports').update({ dialog: 'nonconnection', subject: 'Sem Conexão' }).where({ number: message.from });
                client.sendText(message.from, "Por favor digite o *CPF* do *titular da conta*.");
                break;
            }
            
            // lentidão

            case 2: {
                await database.table('supports').update({ dialog: "slowness", subject: "Lentidão" }).where({ number: message.from });
                client.sendText(message.from, "Por favor digite o *CPF* do *titular da conta*.");
                break;
            }
            // oscilação
            // voltar menu anterior
            // encerrar atendimento
        }
    }
}
export default new SupportTech();