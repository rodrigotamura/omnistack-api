const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app); // agora nosso servidor aceita tanto HTTP quanto Websocket 
// precisamos pegar o http e dizer que ele tbm vai ouvir requisições Websocket
const io = require('socket.io')(server);

// aqui armazenaria os ids de cada socket
// sendo que a melhor prática seria armazenar
// num BD, por exemplo.
const connectedUsers = {
    //<id_user_mongo>: <id_socket>

};

io.on(
    'connection', // toda vez que alguém conectar no nosso app via websocket...
    socket => { // então eu receberei esse socket
        // no momento que algum cliente websocket se conectar, essa mensagem irá aparecer:
        // atraves do const socket = io('http://localhost:3333');

        /* TESTES WEBSOCKET LADO API
        console.log('Nova conexão', socket.id); // todo novo client vai ter um ID de conexão websocket

        socket.on(
            'hello', // ouvindo mensagem do tipo 'hello'
            message => { // tratando o conteudo da mensagem recebida (pode ser um obj)
                console.log(message)
            }
        );

        // e o servidor tbm pode enviar uma mensagem para o cliente:
        // msg do tipo 'world'
        setTimeout(() => {
            socket.emit('world',{
                message: 'Rodrigo Tamura'
            }
            )
        })
        */
        // Sempre eu preciso do ID do socket do cliente para enviar direcionado a ele

        // connectedUsers[ID_USUARIO] = id_socket
        const { user } = socket.handshake.query; // aqui pegaremos os parâmetros passados
        
        connectedUsers[user] = socket.id; // vinculando o id do mongo com o id do socket

    })

/**
 * Conectando no MongoDB Atlas pelo Mongoose
 * 
 */
mongoose.connect('mongodb+srv://tamura:tamura@cluster0-adv9f.mongodb.net/omnistack?retryWrites=true&w=majority',
{
    useNewUrlParser: true
});

/**
 * Middleware
 * basicamente um interceptador, que agente consegue modificar
 * nossa requisição de alguma forma para que chegue no controller de forma diferente
 * Middleware nada mais é como se fosse uma espécie de rota,
 * aonde recebemos o req e o res 
 * O next serve para fazer o fluxo seguir na aplicação
 */

 app.use((req, res, next) => {
     // quando qualquer requisição chagr em nossa aplicação 
     // ela vai parar primeiramente aqui para DEPOIS chegar nas rotas
     // e nos controllers
    req.io = io; // enviando o io para o controller
    req.connectedUsers = connectedUsers; // passando usuários de websocket para o controller

    return next(); // continua o fluxo
 });

/**
 * Por padrão o Express não entende JSON,
 * por isso acrescenta a próxima linha.
 * DEVE SER ANTES DAS ROTAS
 */
app.use(express.json());

/**
 * Para outros fronts acessar nosso API
 * SEMPRE ANTES DE ROUTES
 */
app.use(cors());

/**
 * Não basta importar o arquivo, tem que dar o comando
 * app.use(____) para fazer uso.
 * É como se estivéssemos adicionando um módulo / plugin.
 */
app.use(routes);

server.listen(3333);