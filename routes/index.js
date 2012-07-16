
/*
 * GET home page.
 */


exports.index = function(req, res){
  res.render('index', { title: 'Express'});
};
exports.control = function(req, res){
  res.render('control', { title: 'Mobile Connect' });
};
exports.code = function(req, res){
  var qrcode = req.params.code;
  res.render('mobile', { title: 'Mobile', qrcode: qrcode });
};
