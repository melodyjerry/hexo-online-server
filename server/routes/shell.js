var express = require('express');
var router = express.Router();
var shell = require("../../lib/shell");
var dateFormat = require("../../lib/dateFormat");
var fs = require("fs");
var path = require("path");
var axios = require("axios");
var url = require("url");
var os = require('os');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.user === olConfig.user && req.session.isLogin) {
        switch (req.query.action) {
            case "pull":
                gitPull();
                break;
            case "push":
                gitPush();
                break;
            case "clean":
                shell({ e: "hexo clean" });
                break;
            case "generate": 
                shell({ e: "hexo generate", next: () => { send("渲染完成", "success") } });
                break;
            case "deploy":
                shell({ e: "hexo deploy", next: () => { send("部署完成","success") } });
                break;
            case "server":
                hexoServer();
                break;
            case "close_server":
                closeServer();
                break;
            case "new_post":
                new_post(req.query.post);
                break;
            case "delete_post":
                delete_post(req.query.post);
                break;
            case "save_post":
                save_post(req.query.post, req.query.data);
                break;
            case "new_page":
                new_page(req.query.page);
                break;
            case "delete_page":
                delete_page(req.query.page);
                break;
            case "save_page":
                save_page(req.query.page, req.query.data);
                break;
            default:
                send("Undefined command","error");
                break;
        }
        res.status(200).end();
    } else {
        res.render('login', { script: '' });
    }
}).post('/', function (req, res, next) {
    if (req.session.user === olConfig.user && req.session.isLogin) {
        switch (req.query.action) {
            case "save_post":
                save_post(req.body.post, req.body.data);
                break;
            case "save_page":
                save_page(req.body.page, req.body.data);
                break;
            default:
                send("Undefined command","error");
                break;
        }
        res.status(200).end();
    } else {
        res.render('login', { script: '' });
    }
});
function gitPull() {
    let pull = olConfig.pull;
    shell({
        e: "cd " + hexo.base_dir, next: () => {
            cmds(pull);
        }
    });
}
function cmds(commands, i = 0) {
    if (i < commands.length) {
        shell({
            e: commands[i].replace("{time}", dateFormat('YYYY-MM-DD HH:mm:ss')), next: () => {
                cmds(commands, ++i);
            }
        });
    } else {
        send("-----End-----");
    }
}
function gitPush() {
    let push = olConfig.push;
    shell({
        e: "cd " + hexo.base_dir, next: () => {
            cmds(push);
        }
    });
}
function hexoServer() {
    shell({
        e: "hexo generate", next: () => {
            shell({ e: "hexo server" });
        }
    });
}
function closeServer() {
    let reg = new RegExp(`^.*TCP.*?:${hexo.config.server.port || 4000}.*?LISTEN.*?([\\d]+)`, 'i');
    if (/windows/gim.test(os.type())) {
        shell({
            e: `netstat -ano | findstr ${hexo.config.server.port || 4000}`, stdout: data => {
                let results = data.split("\n");
                for (let i = 0; i < results.length; i++) {
                    let res = results[i] ? results[i].match(reg) : null;
                    if (res && res[1]) {
                        shell({ e: `taskkill /f /pid ${res[1]}`, sendLog: false, next: () => { } });
                        break;
                    }
                }
            }, next: () => { }
        });
    } else if (/linux/gim.test(os.type())) {
        shell({
            e: `netstat -tunlp | grep ${hexo.config.server.port || 4000}`, stdout: data => {
                let results = data.split("\n");
                for (let i = 0; i < results.length; i++) {
                    let res = results[i] ? results[i].match(reg) : null;
                    if (res && res[1]) {
                        shell({ e: `kill ${res[1]}`, sendLog: false, next: () => { } });
                        break;
                    }
                }
            }, next: () => { }
        });
    }
}
function new_post(e) {
    shell({
        e: "hexo new " + e, next: () => {
            let checkExists = setInterval(() => {
                if (fs.existsSync(path.join(hexo.source_dir, '_posts/', e + ".md"))) {
                    clearInterval(checkExists);
                    send("新建《" + e + "》文章成功","success");
                    send("", "reload");
                }
            }, 1000);
        }
    });
}
function delete_post(e) {
    let postName = e.replace("#", "").replace("%23", "");
    fs.unlink(path.join(hexo.source_dir, '_posts/', postName + ".md"), function (err) {
        if (err) {
            send("删除文章《" + postName + "》失败", "error");
            return console.error(err);
        }
        send("删除《" + postName + "》文章成功","success");
        send("", "reload");
    });
}
function save_post(id, data) {
    let postName = id.replace("#", "").replace("%23", "");
    fs.writeFile(path.join(hexo.source_dir, '_posts/', postName + ".md"), data, function (err) {
        if (err) {
            send("保存文章《" + postName + "》失败", "error");
            return console.error(err);
        }
        send("保存《" + postName + "》文章成功","success");
    });
}
function new_page(e) {
    shell({
        e: "hexo new page " + e, next: () => {
            let checkExists = setInterval(() => {
                if (fs.existsSync(path.join(hexo.source_dir, e, "index.md"))) {
                    clearInterval(checkExists);
                    send("新建\"" + e + "\"页面成功","success");
                    send("", "reload");
                }
            }, 1000);
        }
    });
}
function delete_page(e) {
    let page = e.replace("#", "").replace("%23", "");
    let files = fs.readdirSync(path.join(hexo.source_dir, page));
    if (files.length > 1) {
        send("\"" + page + "\"文件夹内有其他文件，请手动删除", "error");
        return;
    }
    fs.unlink(path.join(hexo.source_dir, page, "index.md"), function (err) {
        if (err) {
            send("删除页面\"index.md\"文件失败", "error");
            return console.error(err);
        }
        fs.rmdir(path.join(hexo.source_dir, page), function (err) {
            if (err) {
                send("删除页面\"" + page + "\"失败", "error");
                return console.error(err);
            }
            send("删除\"" + page + "\"页面成功","success");
            send("", "reload");
        });
    });
}
function save_page(id, data) {
    let page = id.replace("#", "").replace("%23", "");
    fs.writeFile(path.join(hexo.source_dir, page, "index.md"), data, function (err) {
        if (err) {
            send("保存页面\"" + page + "\"失败", "error");
            return console.error(err);
        }
        send("保存\"" + page + "\"页面成功","success");
    });
}
module.exports = router;