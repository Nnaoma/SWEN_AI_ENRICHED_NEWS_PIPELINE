import express from 'express';
import { routes } from './router/route_controller.js';

const app = express();

app.listen(3000, () => console.log('Example app listening on port 3000!'));

app.get('/', (req, res) => res.send('Hello World!'));

app.use(routes);
