var app = require('express')();
var server = require('http').Server(app);
var port = process.env.PORT || 3000;

server.listen(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/app/index.html');
});
app.listen(port, function() {
  console.log("Walking Route is running: " + app.get('port'))
});
