require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:urlcode', (req, res) => {
  res.redirect('/'); // TODO: fetch the url for the shorturl code and redirect there.
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;
  const parts = originalUrl.split('/',);
  console.log(parts);
  if (parts.length < 3) {
    res.json({ 'error': 'invalid url' });
  }
  else {
    dns.lookup(parts[2], (err, address, family) => {
      if (err) {
        res.json({ 'error': 'invalid url' });
      }
      else {
        // TODO: Call the URL shortener to create/fetch a shorturl for this url
        res.json({ 'original_url': originalUrl, 'short_url': address });
      }
    });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
