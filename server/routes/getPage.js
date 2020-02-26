var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.user === olConfig.user && req.session.isLogin) {
        let dirName = req.query.page.replace('#', '').replace("%23", "");
        fs.readFile(path.join(hexo.source_dir, dirName, 'index.md'), function (err, data) {
            if(err){
                send("读取文件\"index.md\"失败","warning");
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