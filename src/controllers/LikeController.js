const Dev = require('../models/Dev');

module.exports = {
    // criando um novo like
    async store(req, res) {
        // o Id que vem na rota irá receber o like
        const { devId } = req.params;
        // o user que vem no header da requisição será a pessoa que está dando o like
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user); // pegando infos do usuário
        const targetDev = await Dev.findById(devId); // pegando infos do usuário a receber o like

        if(!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' }); // caso não tenha este usuário
        }
        
        // verificando se o que deu like já não recebeu o like deste, para dar um match!
        if(targetDev.likes.includes(loggedDev._id)) { // includes é uma função do JS para array/objs
            // vamos buscar a conexão de socket ativa
            // os dois Devs serão avisados quando acontecer isso
            const loggedSocket = req.connectedUsers[user]; // buscando ID do socket do usuário logado
            const targetSocket = req.connectedUsers[devId]; // buscando ID socket do user que recebeu o like

            if( loggedSocket ){ // se loggedSocket estiver conectados
                
                req.io.to(loggedSocket) // conectando ao loggedSocket
                    .emit('match', targetDev); // emitindo tipo 'match' os dados do Dev
                
            }

            if(targetSocket) { // se targetSocket estiver conectados
                req.io.to(targetSocket) // conectando ao loggedSocket
                    .emit('match', loggedDev); // emitindo tipo 'match' os dados do Dev
            }
        }

        loggedDev.likes.push(targetDev._id); // ainda não modificou a base

        await loggedDev.save(); // agora sim!

        return res.json({ ok: true });
    }
}