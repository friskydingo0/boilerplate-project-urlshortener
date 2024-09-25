require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
let shortener;
import('./urlShortener.mjs').then((mod) => { shortener = mod });

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:urlcode', (req, res) => {
  shortener.getFullUrl(req.params.urlcode, (err, data) => {
    if (!err) {
      res.redirect(data);
    }
    else {
      res.json(err);
    }
  });

});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;

  shortener.default(originalUrl, (err, data) => {
    if (!err) {
      res.json(data);
    }
    else {
      res.json(err);
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
