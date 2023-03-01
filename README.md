# Rubybot

NodeJs discord bot, built for Ruby discord server. Created for various functionality in discord, including Dofus specific features.

# Docker commands

docker build -t deiiv/rubybot:latest .
docker push deiiv/rubybot:latest

# Sample docker-compose

---
version: "2.1"
services:
  rubybot:
    image: deiiv/rubybot
    container_name: rubybot
    environment:
      - PUID=
      - PGID=
    volumes:
      - /your/volume/rubybot:/rubybot
    restart: unless-stopped