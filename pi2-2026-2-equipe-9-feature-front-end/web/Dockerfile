# Usa uma versão leve do Node.js compatível com Vite
FROM node:20-alpine

# Cria a pasta onde o projeto vai morar dentro do Docker
WORKDIR /app

# Copia os arquivos que listam as dependências
COPY package*.json ./

# Instala os pacotes do projeto (o node_modules do container)
RUN npm install

# Copia todo o resto dos arquivos do seu projeto para dentro do container
COPY . .

# Abre a porta padrão que o Vite usa
EXPOSE 5173

# Executa o comando para ligar o projeto React em modo de desenvolvimento
# e aceitar conexões de qualquer aparelho na rede
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]