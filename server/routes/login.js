var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

/* GET home page. */
router.post('/', function (req, res, next) {
    if (req.body.user === olConfig.user && bcrypt.compareSync(req.body.password, olConfig.passwordHash)) {
        req.session.user = olConfig.user;
        req.session.isLogin = true;
        res.redirect(olConfig.indexPath);
    } else {
        res.render('login', { script: '$(\"#errAlert\").show()'});
    }
});

module.exports = router;