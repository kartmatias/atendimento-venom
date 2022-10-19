import request from 'request';


export function ValidateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    if ( cpf.length != 11 )return;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export async function getUserFromCPF(cpf) {

    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: `${process.env.IXC_URL}/cliente`,
            headers:    
            {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + new Buffer.from(process.env.IXC_TOKEN).toString('base64'),
                ixcsoft: 'listar'
            },
            body:
            { qtype: 'cliente.cnpj_cpf',
                query: cpf,
                oper: '=',
                page: '1',
                rp: '1',
                sortname: 'cliente.id',
                sortorder: 'desc'
            },
            json: true
        };        
        request(options, function (error, response, body) {
            if (error) return reject(error)
            if ( response.statusCode === 401 )return resolve(response);
            if ( response.statusCode === 200 ) {
                resolve(body)
            }
        });
    })
}

export async function getClientLoginStatus(id) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: `${process.env.IXC_URL}/radusuarios`,
            headers:    
            {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + new Buffer.from(process.env.IXC_TOKEN).toString('base64'),
                ixcsoft: 'listar'
            },
            body:
            { qtype: 'radusuarios.id_cliente',
                query: id,
                oper: '=',
                page: '1',
                rp: '1',
                sortname: 'radusuarios.id',
                sortorder: 'desc'
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) return reject(error)
            if ( response.statusCode === 401 )return resolve(response);
            if ( response.statusCode === 200 ) {
                resolve(body)
            }
        });
    })
}