FROM node:8.9.0
WORKDIR /app
COPY . /app
RUN npm install
ENTRYPOINT ["npm"]
CMD ["start"]
