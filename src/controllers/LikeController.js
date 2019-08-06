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
            console.log('Deu match!');
        }

        loggedDev.likes.push(targetDev._id); // ainda não modificou a base

        await loggedDev.save(); // agora sim!

        return res.json({ ok: true });
    }
}