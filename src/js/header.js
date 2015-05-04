var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var headerMainTemplate = require('../templates/headerNavTmpl.hbs');
var guestUserTemplate = require('../templates/guestUser.hbs');
var loggedInUserTemplate = require('../templates/loggedInUser.hbs');
var searchResultTemplate = require('../templates/searchResult.hbs');
var menuTemplate = require('../templates/menu.hbs');
var cityListTemplate = require('../templates/cityList.hbs');
var CookieUtil = require('./cookieutil.js');
var cityList = require('../data/citylist.json');

var HeaderView = function() {

    $('header').html(headerMainTemplate());

    if (localStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(userObj));
    }

    if (sessionStorage.getItem("user")) {
        var userObj = JSON.parse(sessionStorage.getItem("user"));
        $('#user-menu').html(loggedInUserTemplate({
            "userName": userObj.customer_first_name
        }));
    } else {
        $('#user-menu').html(guestUserTemplate());
    }

    $('#main').html(cityListTemplate({
        "cityArray": cityList
    }));

    $('.area-link').click(function(event) {

        event.preventDefault();
        var city = $(event.target).attr('data-city');
        var area = $(event.target).attr('data-area');
        var url = '/api/city/' + city + '/area/' + area;
        $.ajax({
            url: url,
            type: 'GET',
            success: function(response, textStatus, jqXHR) {
                if (response) {
                    console.log('Caterer List -', response);
                    showSearchResult(response);
                } else {
                    console.log('No such caterer found');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Search failed- ', errorThrown);
            }
        });
    });

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
                    if ($('#remember-me').is(':checked')) {
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

    $('.logout-btn').click(function(event) {

        if (localStorage.getItem("user")) {
            localStorage.removeItem("user");
        }
        if (sessionStorage.getItem("user")) {
            sessionStorage.removeItem("user");
        }
        $('#user-menu').html(guestUserTemplate());
    });

    $('#search').click(function(event) {

        var self = this;
        console.log('this- ',this);
        var requestJson = {

            item: $('#search-item').val(),
        };
        $.ajax({
            url: '/api/caterer',
            type: 'GET',
            data: requestJson,
            success: function(response, textStatus, jqXHR) {
                if (response) {
                    console.log('Caterer List -', response);
                    showSearchResult(response);

                } else {
                    console.log('No such caterer found');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Search failed- ', errorThrown);
            }
        });
    });

    var showSearchResult = function(searchResult) {

        $('#main').html(searchResultTemplate({
            "searchArray": searchResult
        }));
        $(".occasion-dpd").change(function(event) {

            var self = this;
            var catererId = $(event.target).attr('data-caterer-id');
            var servingTime = $(this).find('option:selected').val();
            var catererName = $(event.target).attr('data-caterer-name');
            var url = '/api/caterer/menuByTime/' + servingTime + '/' + catererId;
            console.log("menuByTime url- ", url);
            fetchMenuList(url, catererName);
        });
        $(".menu-dpd").change(function(event) {

            var catererId = $(event.target).attr('data-caterer-id');
            var category = $(this).find('option:selected').val();
            var catererName = $(event.target).attr('data-caterer-name');
            var url = '/api/caterer/menuByCategory/' + category + '/' + catererId;
            fetchMenuList(url, catererName);
        });

        var fetchMenuList = function(url, catererName) {

            $.ajax({
                url: url,
                type: 'GET',
                success: function(menuResponse, textStatus, jqXHR) {
                    console.log('Cuisine LIST- ', menuResponse);
                    $('#main').html(menuTemplate({
                        "menuArray": menuResponse,
                        "catererName": catererName
                    }));
                    $('.add-to-cart-btn').click(function(event){
                        var catererId = $(event.target).attr('data-caterer-id');
                        var CuisineId = $(event.target).attr('data-cuisine-id');
                        var CuisinePrice = $(event.target).attr('data-cuisine-price');
                        var quantity = $(event.target).closest('.cuisine-item').find('.item-quantity').val();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(' failed- ', errorThrown);
                }
            });
        };
    };
};

module.exports = HeaderView;