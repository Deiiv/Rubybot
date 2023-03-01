FROM node:18

VOLUME ["/rubybot"]

RUN npm install pm2 -g

CMD "pm2-runtime" "index.js"