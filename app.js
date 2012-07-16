
/**
 * Module dependencies.
 */
var randomstring = require('randomstring');
var QRCode = require('qrcode');
var express = require('express')
  , routes = require('./routes')
  , repl = require('repl');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
var servers = {};
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/code/:code', routes.code);
app.get('/mobile', routes.control);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var server = io
  .of('/server')
  .on('connection',function(socket){
    var id = randomstring.generate();
    servers[id]={server:socket}
    socket.emit('set id', id);
    QRCode.toDataURL(id, function(err,uri){
    socket.emit('qrcode', uri);
    });
    socket.on('return',function(event){
      servers[num].client.emit('return',event);
    });
  });
var client = io
  .of('/client')
  .on('connection', function(socket){
    var id = null;
    var con = null;
    var serve = null;
    socket.on('link', function(event){
      console.log(event);
      id = event;
      serve = servers[id].server;
      servers[id].client = socket;
    });
    socket.on('command', function(event){
      serve.emit('command',event);
      console.log(event);
    });
  });
      
repl.start().context.serv = servers;
       
