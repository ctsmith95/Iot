var express = require('express'),
app = express();
app.use('/', express.static(__dirname + '/public', {maxAge: 31557600000}));
app.use('/modules', express.static(__dirname + '/node_modules', {maxAge: 31557600000}));

//app.use('/data', require('./lib/routes/data'));

app.listen(2000);
