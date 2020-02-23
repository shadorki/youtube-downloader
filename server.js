const express = require('express');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const ClientError = require('./error-handling');

const app = express();

app.use(express.json());

app.get('/video-info?:video', (req, res, next) => {
  const { video } = req.query;
  const url = `https://www.youtube.com/watch?${video}`;
  youtubedl.getInfo(url, null, function(err, info) {
    if(err) next(new ClientError('The youtube link is invalid', 400));
    res.json(info)
  })
})

app.use((err, req, res, next) => {
  if(err instanceof ClientError) {
    res.status(err.code).json({error: err.message})
  } else {
    console.error(err);
    res.status(500).json({
      error: 'An unexpected error occurred'
    })
  }
})

app.listen(3001, () => {
  console.log('Listening on port 3001')
})
