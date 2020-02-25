var express = require('express');
var router = express.Router();
var shell = require("../../shell");
var fs = require("fs");
var path = require("path");
var axios = require("axios");
var url = require("url");

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.user === olConfig.user && req.session.isLogin) {
        switch(req.query.action){
            case "pull":
                gitPull();
                break;
            case "push":
                gitPush();
                break;
            case "clean":
                shell("hexo clean");
                break;
            case "server":
                hexoServer();
                break;
            case "close_server":
                if (server.kill("SIGSTOP")){
                    ws.send(JSON.stringify({ type: "message", data:"Server has been closed"}));
                }else{
                    ws.send(JSON.stringify({ type: "message", data: "Server has been not closed" }));
                }
                break;
            case "deploy":
                shell("hexo deploy");
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
            case "check_flink":
                check_flink();
                break;
            default:
                ws.send(JSON.stringify({type:"message",data:"Undefined command"}));
                break;
        }
        res.status(200).end();
    } else {
        res.render('login', { script: '' });
    }
});
function gitPull() {
    shell("cd " + hexo.base_dir, () => {
        shell("git pull");
    });
}
function gitPush() {
    shell("cd " + hexo.base_dir,()=>{
        shell("git add .",()=>{
            shell(`git commit -m "Update at ${new Date().getTime()}"`,()=>{
                shell("git push");
            });
        });
    });
}
function hexoServer() {
    shell("hexo generate",()=>{
        global.server=shell("hexo server");
    });
}
async function new_post(e){
    shell("hexo new "+e,()=>{
        let checkExists = setInterval(() => {
            if (fs.existsSync(path.join(hexo.source_dir, '_posts/', e + ".md"))) {
                clearInterval(checkExists);
                ws.send(JSON.stringify({ type: "message", data: "新建《" + e + "》文章成功" }));
                ws.send(JSON.stringify({ type: "js", data: "window.location.reload()" }));
            }
        }, 1000);
    });
}
function delete_post(e){
    let postName = e.replace("#", "").replace("%23", "");
    fs.unlink(path.join(hexo.source_dir, '_posts/', postName+".md"), function (err) {
        if (err) {
            ws.send(JSON.stringify({ type: "js", data: "swal('删除文章《" + postName +"》失败',true)" }));
            return console.error(err);
        }
        ws.send(JSON.stringify({ type: "message", data: "删除《" + postName +"》文章成功" }));
        ws.send(JSON.stringify({ type: "js", data: "window.location.reload()" }));
    });
}
function save_post(id,data) {
    let postName = id.replace("#", "").replace("%23", "");
    fs.writeFile(path.join(hexo.source_dir, '_posts/', postName + ".md"), data, function (err) {
        if (err) {
            ws.send(JSON.stringify({ type: "js", data: "swal('保存文章《" + postName + "》失败',true)" }));
            return console.error(err);
        }
        ws.send(JSON.stringify({ type: "message", data: "保存《" + postName + "》文章成功" }));
    });
}
async function new_page(e) {
    shell("hexo new page " + e,()=>{
        let checkExists = setInterval(() => {
            if (fs.existsSync(path.join(hexo.source_dir, e, "index.md"))) {
                clearInterval(checkExists);
                ws.send(JSON.stringify({ type: "message", data: "新建\"" + e + "\"页面成功" }));
                ws.send(JSON.stringify({ type: "js", data: "window.location.reload()" }));
            }
        }, 1000);
    });
}
function delete_page(e) {
    let page = e.replace("#", "").replace("%23", "");
    let files = fs.readdirSync(path.join(hexo.source_dir, page));
    if(files.length>1){
        ws.send(JSON.stringify({ type: "js", data: "swal('\"" + page + "\"文件夹内有其他文件，请手动删除',true)" }));
        return;
    }
    fs.unlink(path.join(hexo.source_dir, page, "index.md"), function (err) {
        if (err) {
            ws.send(JSON.stringify({ type: "js", data: "swal('删除页面\"index.md\"文件失败',true)" }));
            return console.error(err);
        }
        fs.rmdir(path.join(hexo.source_dir, page), function (err) {
            if (err) {
                ws.send(JSON.stringify({ type: "js", data: "swal('删除页面\"" + page + "\"失败',true)" }));
                return console.error(err);
            }
            ws.send(JSON.stringify({ type: "message", data: "删除\"" + page + "\"页面成功" }));
            ws.send(JSON.stringify({ type: "js", data: "window.location.reload()" }));
        });
    });
}
function save_page(id, data) {
    let page = id.replace("#", "").replace("%23", "");
    fs.writeFile(path.join(hexo.source_dir, page, "index.md"), data, function (err) {
        if (err) {
            ws.send(JSON.stringify({ type: "js", data: "swal('保存页面\"" + page + "\"失败',true)" }));
            return console.error(err);
        }
        ws.send(JSON.stringify({ type: "message", data: "保存\"" + page + "\"页面成功" }));
    });
}
function check_flink(){
    let flink=olConfig.flink;
    if(!flink) return;
    flink.map((e,i)=>{
        axios.get(e).then(response => {
            if (response.status === 200) {
                //ws.send(JSON.stringify({type:"message",data:e+" 链接正常"}));
                let myHost = url.parse(hexo.config.url).hostname;
                if (!response.data.includes(myHost)) ws.send(JSON.stringify({ type: "message", data: e + " 友链不存在" }));
            } else {
                let link = url.parse(e);
                link.protocol = link.protocol === 'http' ? 'https' : 'http';
                axios.get(link).then(response => {
                    if (response.status === 200) {
                        //ws.send(JSON.stringify({ type: "message", data: e + " 链接正常" }));
                        let myHost = url.parse(hexo.config.url).hostname;
                        if (!response.data.includes(myHost)) ws.send(JSON.stringify({ type: "message", data: e + " 友链不存在" }));
                    } else {
                        ws.send(JSON.stringify({ type: "message", data: e + " 链接异常" }));
                    }
                }).catch(err => {
                    ws.send(JSON.stringify({ type: "message", data: e + " 链接异常" }));
                });
            }
        }).catch(err => {
            let link = url.parse(e);
            link.protocol = link.protocol === 'http' ? 'https' : 'http';
            axios.get(link).then(response => {
                if (response.status === 200) {
                    //ws.send(JSON.stringify({ type: "message", data: e + " 链接正常" }));
                    let myHost = url.parse(hexo.config.url).hostname;
                    if (!response.data.includes(myHost)) ws.send(JSON.stringify({ type: "message", data: e + " 友链不存在" }));
                } else {
                    ws.send(JSON.stringify({ type: "message", data: e + " 链接异常" }));
                }
            }).catch(err => {
                ws.send(JSON.stringify({ type: "message", data: e + " 链接异常" }));
            });
        });
    });
}
module.exports = router;