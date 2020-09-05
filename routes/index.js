const express = require('express'),
  router = express.Router();

const rootPrefix = "..",
  ShortenUrl = require(rootPrefix + '/app/services/ShortenUrl'),
  GetOriginalUrl = require(rootPrefix + '/app/services/GetOriginalUrl');

router.post('/shorten-url', async function(req, res) {

  const url = req.body.url;

  new ShortenUrl({
    url: url
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });
});

router.get('/get-url', async function(req, res) {

  const short_url = req.query.url;

  new GetOriginalUrl({
    short_url: short_url
  }).perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.success){
        console.log(rsp);
        res.status(200).json(rsp);
        res.send();
      } else {
        res.status(rsp.code).json(rsp);
        res.send();
      }
    }
  });

});

module.exports = router;
