var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var headerMainTemplate = require('../templates/headerNavTmpl.hbs');
var guestUserTemplate = require('../templates/guestUser.hbs');
var loggedInUserTemplate = require('../templates/loggedInUser.hbs');
var searchResultTemplate = require('../templates/searchResult.hbs');
var occasionResultTemplate = require('../templates/occasionResultDetails.hbs');
var cityListTemplate = require('../templates/cityList.hbs');

var cityList = require('../data/citylist.json');

var HeaderView = function() {

    $('header').html(headerMainTemplate());
    if (localStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(userObj));
    } 

    if(sessionStorage.getItem("user")) {
        var userObj = JSON.parse(sessionStorage.getItem("user"));
        $('#user-menu').html(loggedInUserTemplate({
            "userName": userObj.customer_first_name
        }));
    } else {
        $('#user-menu').html(guestUserTemplate());
    }

    $('#main').html(cityListTemplate({"cityArray": cityList}));

    $('.dropdown-menu').find('.form-div').click(function(event) {
        event.stopPropagation();
    });

    $('#sign-up').click(function() {

        var requestJson = {
            customer_first_name: $('#first-name').val(),
            customer_last_name: $('#last-name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address1: $('#address1').val(),
            address2: $('#address2').val(),
            city: $('#city').val(),
            zip: $('#zip').val(),
            password: $('#password1').val(),
            security_question: $('#security-question').val(),
            security_answer: $('#security-answer').val()
        };
        $.ajax({
            url: '/api/user',
            type: 'POST',
            data: requestJson,
            success: function(data, textStatus, jqXHR) {
                console.log('user registered successfully- ', data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('user registered failed- ', errorThrown);
            }
        });

    });

    $('#sign-in').click(function() {

        var requestJson = {

            email: $('#login-email').val(),
            password: $('#login-password').val(),

        };

        $.ajax({
            url: '/api/user',
            type: 'GET',
            data: requestJson,
            beforeSend: function(jqXHR, settings) {
                if (requestJson.email.trim() !== "" && requestJson.password.trim() !== "") {
                    return true;
                } else {
                    console.log("empty credentials");
                    return false;
                }
            },
            success: function(data, textStatus, jqXHR) {
                if (data) {
                    console.log('user logged in successfully-', data);
                    sessionStorage.setItem("user", JSON.stringify(data));
                    if($('#remember-me').is(':checked')) {
                        console.log('remember me');
                        localStorage.setItem("user", JSON.stringify(data));
                    }
                    $('#user-menu').html(loggedInUserTemplate({
                        "userName": data.customer_first_name
                    }));
                } else {
                    console.log('No such user found');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('user login failed- ', errorThrown);
            }
        });

    });

    $('.logout-btn').click(function() {

        if (localStorage.getItem("user")) {
            localStorage.removeItem("user");
        }
        if(sessionStorage.getItem("user")) {
            sessionStorage.removeItem("user");
        }
        $('#user-menu').html(guestUserTemplate());
    });

    $('#search').click(function() {

        var requestJson = {

            item: $('#search-item').val(),

        };
        $.ajax({
            url: '/api/caterer',
            type: 'GET',
            data: requestJson,
            success: function(data, textStatus, jqXHR) {
                if (data) {
                    console.log('Caterer List -', data);

                    $('#main').html(searchResultTemplate({"searchArray": data}));
                } else {
                    console.log('No such caterer found');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Search failed- ', errorThrown);
            }
        });

    });


    $('#breakfast').click(function() {

        var requestJson = {

        item: $('#breakfast').val($(this).find(":selected").text()),

        };
        $.ajax({
            url: '/api/caterer/occasion/breakfast',
            type: 'GET',
            data: requestJson,
            success: function(data, textStatus, jqXHR) {
                console.log('BREAKFAST LIST- ', data);
                $('#main').html(occasionResultTemplate({"searchArray": data}));
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(' failed- ', errorThrown);
            }
        });

    });

};

module.exports = HeaderView;