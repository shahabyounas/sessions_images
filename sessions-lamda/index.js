const serverless = require("serverless-http");
const express = require("express");
const helmet = require('helmet')
const dotenv = require('dotenv')
const app = express();
const test = app.get('env') == 'development'
dotenv.config()




app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())

function error(err, req, res, next){

  if(!test) {
    console.error(err.stack)
  }

  res.status(500).json({ message: 'Internal Server error' })
}


app.use('/api/v1', require('./api_v1'))


app.get('/', function(req, res) {
  res.send('This is root route')
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found here",
  });
});

app.use(error)

module.exports.handler = serverless(app, { provider: 'aws' });
