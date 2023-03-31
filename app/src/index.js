require('./data/index.js').init(); // Initialize the data tier

const express = require('express'),
      helmet = require('helmet'),
      morgan = require('morgan'),
      cors = require('cors'),
      router = require('./api/controllers/index.js');
      
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(router);

if(process.env.ENV==='test'){
      module.exports = app;
}
else{
      app.listen(process.env.PORT, ()=>console.log(`Started app server at ${process.env.PORT}.`));
}