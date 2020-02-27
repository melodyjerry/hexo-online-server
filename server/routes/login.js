var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var axios = require('axios');
var dateFormat = require("../../lib/dateFormat");

/* GET home page. */
router.post('/', function (req, res, next) {
    if (req.body.user === olConfig.user && bcrypt.compareSync(req.body.password, olConfig.passwordHash)) {
        if (olConfig.noticeUrl) axios.get(`${olConfig.noticeUrl}${encodeURIComponent(`${dateFormat('YYYY-MM-DD HH:mm:ss')} 用户${req.body.user}登录Hexo online`)}`);
        req.session.user = olConfig.user;
        req.session.isLogin = true;
        res.redirect(olConfig.indexPath);
    } else {
        res.render('login', { script: '$(\"#errAlert\").show()'});
    }
});
module.exports = router;