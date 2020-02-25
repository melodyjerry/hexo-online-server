const { exec } = require('child_process');

function shell(e,next=()=>{}) {
    ws.send(JSON.stringify({ type: "message", data: '> ' + e }));
    
    let command=exec(e, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            ws.send(JSON.stringify({ type: "error", data: error }));
            return;
        }
        return;
    });
    command.stdout.on('data', (data) => {
        console.log(data);
        ws.send(JSON.stringify({ type: "message", data: data }));
    });
    command.stderr.on('data', (data) => {
        console.log(data);
        ws.send(JSON.stringify({ type: "message", data: data }));
    });
    command.on('exit', (code) => {
        next();
    });
    return command;
}

module.exports = shell;