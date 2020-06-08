import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import routes from "./routes";
import {User} from "./entity/User";

// create express app
const app = express();

createConnection().then(() => {
  console.log('Conexão com PostgreSQL com sucesso.')
}).catch((err) => {
  console.log('Erro na conexão com o DB.')
})

app.use(bodyParser.json());

app.use(routes)

app.listen(3000)

