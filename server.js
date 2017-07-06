const ENV = process.env.NODE_ENV;
const isDev = ENV === 'development' ? true : false;
if (!isDev) {
  const atatus = require("atatus-node");
  atatus.start({ apiKey: "12345" });
}
const express = require('express');
const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');
const configJSON = require('./config.json');
const myLocalIp = require('my-local-ip');
const bodyParser = require('body-parser');
const http = require('http');
/* eslint-disable no-console */

const app = express();

process.setMaxListeners(0);
const port = configJSON.appPort;
const buildPath = config.output.path;
const publicPath = config.output.publicPath;
const api = require('./server/index');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

console.log('Current environment: ' + ENV.toUpperCase());

app.use('/api', api);

app.use('/images', express.static(path.join(__dirname, './public/images')));

if (isDev) {
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    quiet: false,
    noInfo: false,
    path: buildPath,
    publicPath: publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.use(express.static(path.join(__dirname, './public')));
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, './src/index.html'));
    // res.sendFile(path.join( __dirname, './src/index.html'));
  });
} else {
  // We point to our static assets
  app.use(express.static(config.output.path));

  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

const server = new http.Server(app);
const io = require('socket.io')(server);
global.socketIO = io;

io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
    console.log(data, 'join');
    socket.join(data.user_id);
  });
});


server.listen(port, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('Listening on ' + myLocalIp() + ":" + this.address().port);
  }
});
