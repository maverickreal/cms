FROM node
WORKDIR .
COPY . .
ENV JWTSECRETKEY=12345 \
DBNAME=cmsdb \
DBHOST=mongodb \
DBPORT=27017
CMD npm install && npm run start