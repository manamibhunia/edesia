var application_root = __dirname,
http = require('http'),
express = require('express'),
path = require("path"),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
errorHandler = require('errorhandler');

var app = express();

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(application_root, 'dist')));

app.use(errorHandler());
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!' + err.stack);
});

var port = process.env.PORT || 3000;
var router = express.Router();

//================== ROUTES ======================================

var api = require('./routes/api');
var web = require('./routes/web');
app.use('/api', api);
app.use('/', web);

// router.get('/login/:username/:password', function(req, res) {
//
//     var username = req.params.username;
//     var password = req.params.password;
// });
//
// app.get('/', function(req, res) {
//
//     res.render('index.html');
// });

app.listen(port);
console.log('Server started on ' + port);
