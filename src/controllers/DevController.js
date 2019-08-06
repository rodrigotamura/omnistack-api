const axios = require('axios');
const Dev = require('../models/Dev');
/**
 * Aqui irão todos os métodos que irá manipular a model - se necessário.
 */
module.exports = {
    // listando Devs
    async index(req, res) {
        // buscando o user logado (header)
        const { user } = req.headers;
        const loggedUser = await Dev.findById(user);

        // buscando todos usuário que não são usuário logado, nem que já deu like e deslike
        const users = await Dev.find({
            $and: [ // aplica o && de uma vez só
                { _id: { $ne: user } },// buscando o que não é logado ($ne: not equal)
                { _id: { $nin: loggedUser.likes } }, // buscar que não esteja dentro da lista (like) ($nin: not in)
                { _id: { $nin: loggedUser.deslikes } }, // buscar que não esteja dentro da lista (deslike) ($nin: not in)
            ]
        });

        return res.json(users);
    },

    // Novo registro
    async store(req, res) {
        // Acessando dados do usuário no GitHub
        const { username } = req.body;

        // verificando antes se o usuário já não existe cadastrado em nosso BD
        const userExists = await Dev.findOne({ user: username });
        if(userExists) {
            return res.json({userExists, response: 'This user is already created'}); // retorna o usuário encontrado
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        // baseado na response do GitHub, vamos armazenar no banco
        try{
            const { 
                name, 
                bio, 
                avatar_url: avatar 
            } = response.data; // desestruturação

            const dev = await Dev.create({ // salvando no BD
                name, user: username , bio, avatar
            });
        } catch(err) {
            return res.json({ err });
        }

        return res.json(dev); // retornando o que foi registrado
    },

}