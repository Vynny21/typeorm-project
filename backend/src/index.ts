import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors'
import * as helmet from 'helmet'
import routes from "./routes/routes";

// create express app
const app = express();

createConnection().then(() => {
  console.log('Conexão com PostgreSQL com sucesso.')
}).catch((err) => {
  console.log('Erro na conexão com o DB.')
})

app.use(bodyParser.json());
app.use(cors())
app.use(routes)
app.use(helmet())
app.listen(3000)

