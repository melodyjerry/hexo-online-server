global.hexo = hexo;
global.olConfig = require("./lib/getConfig");
var WebSocket = require('ws');
var app = require('./server/app');
var http = require('http');
var https = require('https');
var bcrypt = require('bcryptjs');
var fs = require('fs');

hexo.extend.console.register('bcrypt', 'Bcrypt your password', function (args) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(args._[0], salt);
    console.log("passwordHash:" + hash);
});

hexo.extend.console.register('online', 'Start online server', function (args) {
    var wssOption = { port: olConfig.wsPort };
    var HTTPS_OPTOIN = {};
    if (olConfig.ssl) {
        var privateCrt = fs.readFileSync(olConfig.privateCrt, 'utf8');
        var privateKey = fs.readFileSync(olConfig.privateKey, 'utf8');
        HTTPS_OPTOIN = {
            key: privateKey,
            cert: privateCrt
        };
        var wssApp = https.createServer(HTTPS_OPTOIN, (req, res) => { res.writeHead(200); res.end(); }).listen(olConfig.wsPort);
        wssOption = { server: wssApp };
    }

    var port = normalizePort(olConfig.port || '3000');
    app.set('port', port);

    var server = olConfig.ssl ? https.createServer(HTTPS_OPTOIN, app) : http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    var wss = new WebSocket.Server(wssOption);
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


