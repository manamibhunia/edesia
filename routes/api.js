//================================== routes for API ====================================
var express = require('express'),
    connection = require('express-myconnection'),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    app = express();

module.exports = (function() {
    'use strict';
    var api = express.Router();
    app.use(bodyParser.json());

    var pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'cmpe226'
    });

    var user = api.route('/user');

    user.get(function(request, response) {

        var query = 'select * from customer where email="' + request.query.email + '"';

        console.log('query- ', query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Customer List: ', rows);
                connection.release();

                if (rows.length > 0) {
                    console.log('email correct');
                    var userObj = rows[0];
                    if (userObj.password === request.query.password) {
                        console.log('email correct & password correct');
                        response.send(userObj);
                    } else {
                        console.log('email correct & password incorrect');
                        response.send("");
                    }
                } else {
                    console.log('email incorrect');
                    response.send("");
                }
            });
        });
    });

    user.post(function(request, response) {

        console.log('Data: ', request.body);
        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO customer SET ?', request.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                response.send({
                    message: 'Customer Added'
                });
            });
        });
    });

    //var caterer = api.route('/caterer');

    //caterer.get(function(req, res) {

    //pool.getConnection(function(err, connection) {
    // connection.query('SELECT * FROM caterer', function(err, rows) {

    // if (err) {
    //console.log(err);
    //   if (err) return err;
    //}
    //console.log('Caterer List: ', rows);
    //connection.release();
    // res.send(rows);
    // });
    //  });
    //});

    var caterer = api.route('/caterer');

    caterer.get(function(request, response) {

        var item = request.query.item;
        var query = '';
        if (isNaN(item)) {

            query = 'SELECT * FROM caterer WHERE city="' + item + '" OR caterer_type ="' + item + '"';
        } else {
            query = 'SELECT * FROM caterer WHERE zip=' + item;
        }

        console.log('query- ', query);

        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Caterer List: ', rows);
                connection.release();
                response.send(rows);
            });
        });
    });

    var caterer_occasion_breakfast= api.route('/caterer/occasion/breakfast');

    caterer_occasion_breakfast.get(function(request, response) {

        pool.getConnection(function(err, connection) {
            connection.query('SELECT cuisine_name, price FROM cuisine WHERE cuisine_occasion="'+ request.query.item + '"', function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Breakfast List: ', rows);
                connection.release();
                response.send(rows);
            });
        });
    });

    var caterer_type = api.route('/caterer/caterer_type');

    caterer_type.get(function(req, res) {

        pool.getConnection(function(err, connection) {
            connection.query('SELECT * FROM caterer WHERE caterer_type="Italian"', function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Caterer List: ', rows);
                connection.release();
                res.send(rows);
            });
        });
    });

    caterer.post(function(req, res) {

        console.log('Data: ', req.body);

        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO caterer SET ?', req.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                res.send({
                    message: 'Caterer Added'
                });
            });
        });
    });

    var cuisine = api.route('/cuisine');

    cuisine.get(function(req, res) {

        pool.getConnection(function(err, connection) {
            connection.query('SELECT * FROM cuisine', function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Cuisine List: ', rows);
                connection.release();
                res.send(rows);
            });
        });
    });

    cuisine.post(function(req, res) {

        console.log('Data: ', req.body);

        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO cuisine SET ?', req.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                res.send({
                    message: 'Cuisine Added'
                });
            });
        });
    });

    var order_details = api.route('/order_details');

    order_details.get(function(req, res) {

        pool.getConnection(function(err, connection) {
            connection.query('SELECT * FROM order_details WHERE orderid', function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Order details: ', rows);
                connection.release();
                res.send(rows);
            });
        });
    });

    order_details.post(function(req, res) {

        console.log('Data: ', req.body);

        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO orders SET ?', req.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                res.send({
                    message: 'Order Added'
                });
            });
        });
    });


    return api;
})();