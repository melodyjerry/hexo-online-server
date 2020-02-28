global.hexo = hexo;
global.olConfig = require("./lib/getConfig");
var WebSocket = require('ws');
var app = require('./server/app');
var http = require('http');
var bcrypt = require('bcryptjs');

hexo.extend.console.register('bcrypt', 'Bcrypt your password', function (args) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(args._[0], salt);
    console.log("passwordHash:" + hash);
});

hexo.extend.console.register('online', 'Start online server', function (args) {
    var port = normalizePort(olConfig.port || '3000');
    app.set('port', port);

    var server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    var wss = new WebSocket.Server({ port: olConfig.wsPort });
    wss.on('connection', function connection(ws) {
        function send(data, type = "message") {
            ws.send(JSON.stringify({ type, data }));
        }
        global.send = send;
    });

    function normalizePort(val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    }

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

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

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    }
});


