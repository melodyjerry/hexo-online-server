const { exec } = require('child_process');
var iconv = require('iconv-lite');

function shell({ e, next = () => { }, stdout = null, stderr=null,options={},sendLog=true}) {
    ws.send(JSON.stringify({ type: "message", data: '> ' + e }));
    
    let command = exec(e, (error, options, stdout, stderr) => {
        if (error) {
            console.log(error);
            if (error.cmd === 'hexo server'){
                ws.send(JSON.stringify({ type: "message", data: 'Hexo server 已关闭' }));
            }else{
                ws.send(JSON.stringify({ type: "error", data: error }));
            }
            return;
        }
        return;
    });
    command.stdout.on('data', stdout ? stdout:(data) => {
        console.log(data);
        if (sendLog) ws.send(JSON.stringify({ type: "message", data: data }));
    });
    command.stderr.on('data', stderr ? stderr:(data) => {
        console.log(data);
        if (sendLog) ws.send(JSON.stringify({ type: "message", data: data }));
    });
    command.on('exit', (code) => {
        next();
    });
    return command;
}

module.exports = shell;