var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.user === olConfig.user && req.session.isLogin) {
        let fileName = req.query.post.replace('#', '').replace("%23", "") + '.md';
        fs.readFile(path.join(hexo.source_dir, '_posts/', fileName), function (err, data) {
            if(err){
                ws.send(JSON.stringify({ type: "message", data:"读取文件\""+fileName+"\"失败"}));
                res.json({ success: false, data:err });
                console.error(err);
                return;
            }
            res.json({success:true,data:data.toString()});
        });
    } else {
        res.render('login', { script: '' });
    }
});
module.exports = router;