import express from "express";
import httpServer from "http";
import cors from "cors";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import "./whatsapp";
const HOSTNAME = process.env.HOSTNAME || "localhost"
const PORT = process.env.PORT ?? 3333;
import { existsSync } from "fs"
import { join } from "path";

const app = express();
const http = httpServer.createServer(app);

export const io = new Server(http, {
    cors: {
        origin: '*'
    }
})


// @config cors
app.use(cors({
    origin: "*",
}))

app.use(express.json());

export function auth(request, response, next) {
    const token = request.headers['x-access-token'];
    
    if ( !token )return response.status(401).json({ error: 'Não encontramos o token no cabeçalho da requisição.' });
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if ( err )return response.status(401).json({ error: "token inválido!" });
        request.user = decoded.user;
        next();
    })
}

// @controllers v1
import User from "./app/controllers/UserController"
app.use('/v1/users', User);

import Support from "./app/controllers/SupportsController";
app.use('/v1/supports', Support);

import Message from "./app/controllers/MessageController";
app.use('/v1/messages', Message);


app.get('/storages/:filename', (request, response) => {
    const { filename } = request.params;
    if ( !filename ){
        return response.status(500).json({ error: "Arquivo não encontrado" });
    }
    const fileName = join("./src", "uploads", "images", filename);
    console.log(fileName);
    if ( !existsSync(fileName) ) {
        return response.status(404).json({ error: "Arquivo não encontrado." });
    }
    response.download(fileName);
});

http.listen(PORT, HOSTNAME, () => {
    console.log(`- servidor iniciado com sucesso em ${HOSTNAME}:${PORT}!`);
})