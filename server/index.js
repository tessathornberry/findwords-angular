require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require('cors');
const morgan = require('morgan');
const controllers = require('./controllers.js');
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/wordSearch', (req, res) => {
  controllers.searchWords(req.query, (err, results) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200).json(results);
    }
  })
});

const port = process.env.PORT || 2999;

app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);