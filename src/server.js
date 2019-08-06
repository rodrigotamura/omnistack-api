const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

server = express();

/**
 * Conectando no MongoDB Atlas pelo Mongoose
 * 
 */
mongoose.connect('mongodb+srv://tamura:tamura@cluster0-adv9f.mongodb.net/omnistack?retryWrites=true&w=majority',
{
    useNewUrlParser: true
});

/**
 * Por padrão o Express não entende JSON,
 * por isso acrescenta a próxima linha.
 * DEVE SER ANTES DAS ROTAS
 */
server.use(express.json());

/**
 * Para outros fronts acessar nosso API
 */
server.use(cors());

/**
 * Não basta importar o arquivo, tem que dar o comando
 * server.use(____) para fazer uso.
 * É como se estivéssemos adicionando um módulo / plugin.
 */
server.use(routes);

server.listen(3333);