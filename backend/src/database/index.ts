import { createConnection } from 'typeorm'

createConnection().then(() => {
  console.log('Conexão com PostgreSQL com sucesso.')
}).catch((err) => {
  console.log('Erro na conexão com o DB.:' + err)
})
