var app = require('express')();
var server = require('http').Server(app);
var port = process.env.PORT || 3000;

app.set('port', port);
app.use(express.static(__dirname + '/app'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/app/index.html');
});
app.listen(app.get('port'), function() {
  console.log("Walking Route is running: " + app.get('port'));
});
