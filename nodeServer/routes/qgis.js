var express = require('express');
var router = express.Router();

/* GET QGIS. */
router.get('/qgis', function(req, res, next) {
  res.render('qgis');
});

module.exports = router;
