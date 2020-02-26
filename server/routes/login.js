var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var axios = require('axios');

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
function dateFormat(fmt, date=new Date()) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),
        "M+": (date.getMonth() + 1).toString(),
        "D+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "m+": date.getMinutes().toString(),
        "s+": date.getSeconds().toString()
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
module.exports = router;