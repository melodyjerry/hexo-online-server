global.hexo = hexo;
global.olConfig = require("./getConfig");
var WebSocket = require('ws');
var app = require('./server/app');
var http = require('http');
var bcrypt = require('bcryptjs');

hexo.extend.console.register('bcrypt', 'Bcrypt your password', function (args) {
    //var salt = bcrypt.genSaltSync(10);
    //var hash = bcrypt.hashSync(args._[0], salt);
    //console.log(hash);
    console.log(hexo.source_dir);
});

hexo.extend.console.register('online', 'Start online server', function (args) {
    //Get port from config in Express.
    var port = normalizePort(olConfig.port || '3000');
    app.set('port', port);

    //Create HTTP server.
    var server = http.createServer(app);

    //Listen on provided port, on all network interfaces.
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    var wss = new WebSocket.Server({ port: olConfig.wsPort });
    wss.on('connection', function connection(ws) {
        global.ws = ws;
    });

    //Normalize a port into a number, string, or false.
    function normalizePort(val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            // named pipe
            return val;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return false;
    }

    //Event listener for HTTP server "error" event.
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    //Event listener for HTTP server "listening" event.
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    }
});


