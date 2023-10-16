import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { calculateInsuranceQuote } from './utils/helper';
import cors from 'cors';
import * as bodyParser from 'body-parser'
import { routesConfig } from './routes'

const app = express();
const port = 3000;
app.use(bodyParser.json())
app.use(cors({ origin: true }))
routesConfig(app)
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app