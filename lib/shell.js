const { exec } = require('child_process');

function shell({ e, next = () => { }, stdout = null, stderr=null,options={},sendLog=true}) {
    send('> ' + e);
    
    let command = exec(e, (error, options, stdout, stderr) => {
        if (error) {
            console.log(error);
            if (error.cmd === 'hexo server'){
                send('Hexo server 已关闭');
            }else{
                send(error, "error");
            }
            return;
        }
        return;
    });
    command.stdout.on('data', stdout ? stdout:(data) => {
        console.log(data);
        if (sendLog) send(data);
    });
    command.stderr.on('data', stderr ? stderr:(data) => {
        console.log(data);
        if (sendLog) send(data);
    });
    command.on('exit', (code) => {
        next();
    });
    return command;
}

module.exports = shell;