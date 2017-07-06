var rsmq_worker = require('rsmq-worker');
var config = require ('../config');

module.exports = {
  registerUserToChannel: function(userId) {
    var io = global.socketIO;
    var queue = 'transactions';
    var options = {
      host: config.redisForSMQ.host,
      port: config.redisForSMQ.port
      // host: '172.16.0.15',
      // port: 6379
    };
    var rsmq_w = new rsmq_worker(userId, options);
    rsmq_w.on('message', function(msg, next, id){
      console.log(msg);
      // io.sockets.emit('transactions', msg);
      io.sockets.in(userId).emit('transactions', msg);
      next();
    });
    rsmq_w.start();
  }
};
