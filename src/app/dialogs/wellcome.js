import database from '~/database';

class Wellcome
{
    async execute(client, message) {
        const option = parseInt(message.body);
        switch(option){

            // suporte técnico
            case 1: {
                await database.table('supports').update({ dialog: 'supporttech' }).where({ number: message.from });
                client.sendText(message.from, 'Selecione uma das opções:\n\n*1* - Sem conexão.\n*2* - Lentidão.\n*3* - Oscilação\n*4* - Voltar ao menu anterior.\n*0* - Encerrar atendimento.');
                break;
            }
            
            // Financeiro
            case 2: {
                break;
            }

            // Comercial
            case 3: {
                break;
            }

            // Encerrar atendimento
            case 0: {
                break;
            }
        }
    }
}
export default new Wellcome();