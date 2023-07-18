import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import router from './routes';
import path = require('path');

dotenv.config();

const app = express();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'view'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors());

app.use('/api', router);


export default app;