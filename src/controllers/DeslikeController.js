const Dev = require('../models/Dev');

module.exports = {
    // criando um novo deslike
    async store(req, res) {
        // o Id que vem na rota irá receber o deslike
        const { devId } = req.params;
        // o user que vem no header da requisição será a pessoa que está dando o deslike
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user); // pegando infos do usuário
        const targetDev = await Dev.findById(devId); // pegando infos do usuário a receber o deslike

        if(!targetDev) {
            return res.status(400).json({ error: 'Dev not exists' }); // caso não tenha este usuário
        }

        loggedDev.deslikes.push(targetDev._id); // ainda não modificou a base

        await loggedDev.save(); // agora sim!

        return res.json({ ok: true });
    }
}