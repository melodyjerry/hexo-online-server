var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    req.session.destroy(function (err) {
        if(err){
            req.session.user = "default";
            req.session.login = false;
        }
        res.redirect(olConfig.indexPath);
    });
});

module.exports = router;