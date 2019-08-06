const express = require('express');

const routes = express.Router();

// Controllers
const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DeslikeController = require('./controllers/DeslikeController');

routes.get('/devs', DevController.index); // usando o método index deste controller
routes.post('/devs', DevController.store);

routes.post('/devs/:devId/likes', LikeController.store);

routes.post('/devs/:devId/deslikes', DeslikeController.store);

/*
routes.get('/', (req, res) => {
    return res.send('Paz do Senhor!');
});

route.post('/devs', (req, res) => {
    return res.json(req.body);
});
*/
module.exports = routes;