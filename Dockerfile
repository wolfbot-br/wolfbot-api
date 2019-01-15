FROM ubuntu

LABEL maintainer 'Wolfbot <wolfbotbr@gmail.com>'

#instalando pacotes necessários para rodar api
RUN apt-get update \
    && apt-get install -y build-essential \
    && apt-get install -y curl

#instalando node versão 8.x
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs

ENV HOME=/home/app

COPY package.json package-lock.json $HOME/api/

WORKDIR $HOME/api

RUN npm install

COPY . $HOME/api

CMD [ "npm", "run", "dev" ]