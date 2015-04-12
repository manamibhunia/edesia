var express = require('express');
var errorHandler = require('errorhandler');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));
app.use(errorHandler());
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!' + err.stack);
});

var port = process.env.PORT || 3000;
var router = express.Router();

router.get('/login/:username/:password', function(req, res) {

    var username = req.params.username;
    var password = req.params.password;
});

app.get('/', function(req, res) {

    res.render('index.html');
});

app.use('/api', router);

app.listen(port);
console.log('Server started on ' + port);
