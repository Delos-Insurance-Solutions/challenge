import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser'
import { routesConfig } from './routes'
import { createConnection } from 'typeorm';

const app = express();
const port = 3000;
app.use(bodyParser.json())
app.use(cors({ origin: true }))
routesConfig(app)
app.use(express.json());

async function dbConnection() {
  try {
    await createConnection();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

dbConnection();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app