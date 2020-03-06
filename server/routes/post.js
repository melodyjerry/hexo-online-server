var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.user === olConfig.user && req.session.isLogin) {
        fs.readdir(path.join(hexo.source_dir, '_posts'), function (err, files) {
            if (err) {
                res.render('post', { posts: [] });
                console.error(err);
                return;
            }
            let posts = files.map((e, i) => {
                return e.replace(/\.md$/, '');
            });
            if (req.query.pjax) {
                res.render('post', { posts, autoSave: olConfig.autoSave });
            } else {
                res.render('index', { wsPort: olConfig.wsPort, path: "post", posts, autoSave: olConfig.autoSave, ssl: olConfig.ssl });
            }
        });
    } else {
        res.render('login', { script: '' });
    }
});

module.exports = router;