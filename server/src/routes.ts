import express from 'express';

const routes = express.Router();

routes.get('/users', (request, response) => {
    return response.json({ message: "Hello World" })
});

routes.get('/hi', (request, response) => {
    return response.json({ message: "Tudo Ok" })
});

export default routes;