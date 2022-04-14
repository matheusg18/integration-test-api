# Integration test API

Repositório do [artigo](https://dev.to/matheusg18/testes-de-integracao-para-api-com-typescript-mocha-chai-e-sinon-3np9).

## Instruções

### Para rodar a API

1. Instale as dependências

   ```bash
   npm install
   ```

2. Inicie um container MySQL (**recomendado**)

   ```bash
   docker container run -d -e MYSQL_ROOT_PASSWORD=password -p 3336:3306 mysql:latest
   ```

3. Renomeie o `.env.example` para `.env`. Se você **não** for usar o MySQL do container acima ajuste o `DATABASE_URL` de acordo com a [documentação do prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-mysql)

4. Rode a migration do prisma

   ```bash
   npx prisma migrate dev
   ```

5. Inicie a API

   ```bash
   npm start
   ```

### Para rodar os testes

1. Instale as dependências

   ```bash
   npm install
   ```

2. Rode o script de teste

   ```bash
   npm test
   ```
