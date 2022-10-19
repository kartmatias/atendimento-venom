import express from "express";
import database from "~/database"
import jwt from "jsonwebtoken";
import { Hash } from "~/app/utils/fn.js";
import { auth } from "../../server";

const router = express.Router();

// login
router.post('/login', async (request, response) => {
    const { username, password } = request.body;
    if ( !username || !password )return response.status(500).json({ error: "Informe seu nome de usuario e senha." });
    
    const pass = Hash(password);
    const responseUser = await database.table('users').where({ username, password: pass })
    const user = responseUser[0];
    if ( !user )return response.status(401).json({ error: "Usuário ou senha errado." });

    const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: 60 * 60 * 24 })
    return response.status(200).json({ token });
})

// index
router.get('/', auth, async (request, response) => {
    const users = await database.table('users');
    return response.status(200).json({ registers: users });
})

// get user
router.get('/me', auth, async (request, response) => {
    return response.status(200).json(request.user);
});

// create
router.post('/', async (request, response) => {
    const { username, password, avatar_url } = request.body;
    try {
        const pass = Hash(password);
        const data = { username, password: pass, avatar_url };
        const user = await database.table('users').insert(data);
        response.status(201).json(user[0]);
    } catch (error) {
        response.status(500).json({ error: error.toString() })
    }
});

export default router;