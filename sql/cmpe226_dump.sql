/*
 Navicat Premium Data Transfer

 Source Server         : bonnie
 Source Server Type    : MySQL
 Source Server Version : 50536
 Source Host           : localhost
 Source Database       : cmpe226

 Target Server Type    : MySQL
 Target Server Version : 50536
 File Encoding         : utf-8

 Date: 05/03/2015 02:48:22 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `caterer`
-- ----------------------------
DROP TABLE IF EXISTS `caterer`;
CREATE TABLE `caterer` (
  `caterer_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `caterer_name` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address1` varchar(200) NOT NULL,
  `address2` varchar(200) DEFAULT NULL,
  `city` varchar(150) DEFAULT NULL,
  `zip` bigint(20) unsigned NOT NULL,
  `cuisine_type` varchar(50) NOT NULL,
  `state` varchar(150) NOT NULL,
  `area` varchar(150) NOT NULL,
  PRIMARY KEY (`caterer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `caterer`
-- ----------------------------
BEGIN;
INSERT INTO `caterer` VALUES ('1', 'Picazzo Cuisine', 'picazzo@yahoo.com', '3345556789', '12 w figuiere st', 'apt# 5', 'Santa Cruz', '95126', 'Italian', 'CA', ''), ('2', 'La Amigo', 'amigo@gmail.com', '408272543', '23 E elgo st', 'house # 5', 'San Jose', '95121', 'Mexican', 'CA', ''), ('3', 'Anya', 'anya@yahoo.com', '6788777568', '2 e sc st', 'apt 5', 'Santa Clara', '95050', 'Indian', 'CA', ''), ('4', 'Radhe Chat', 'radhe@gmail.com', '4087898987', '123 E El camino real', null, 'Santa Clara', '95051', 'Indian', 'CA', ''), ('5', 'Bangalore Cafe', 'bcafe@gmail.com', '3424534567', '120 E El Camino Real', null, 'Santa Clara', '95051', 'Indian', 'CA', ''), ('8', 'El Paso', 'elpaso@yahoo.com', '4078908765', '12 E San Carlos St', 'House # 4', 'San Jose', '95126', 'Italian', 'CA', 'Milpitas');
COMMIT;

-- ----------------------------
--  Table structure for `cuisine`
-- ----------------------------
DROP TABLE IF EXISTS `cuisine`;
CREATE TABLE `cuisine` (
  `cuisine_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cuisine_name` varchar(100) DEFAULT NULL,
  `cuisine_type` varchar(30) DEFAULT NULL,
  `ingredients` varchar(200) DEFAULT NULL,
  `cuisine_serving_time` varchar(100) DEFAULT NULL,
  `cuisine_category` varchar(100) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`cuisine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `cuisine`
-- ----------------------------
BEGIN;
INSERT INTO `cuisine` VALUES ('2', 'Masala Tea', 'Indian', 'Garam Masala and Tea leaves, milk, water, sugar', 'Breakfast', 'Beverages', 'masalatea.jpg'), ('3', 'Turkey Buritto', 'Mexican', 'rosted turkey with hot chilly sauce', 'Lunch,Dinner', 'Main Course', 'turkeyburitto.jpg'), ('4', 'Chicken Do pyaja', 'Indian', 'chicken with onion, chilly, ginger, garlic, garam masala ', 'Lunch,Dinner', 'Main Course', 'chickendopyaja.jpg'), ('6', 'Roasted Turkey Breast', 'American', 'cabbage, green bell pepper, avocado with django masters', 'Lunch,Dinner', 'Salad', 'roastedturkeybreast.jpg'), ('7', 'Roasted Turkey Breast', 'American', 'Turkey Breast roasted on grill with red sauce', 'Lunch, Dinner', 'Main Course', 'roastedturkeybreast.jpg'), ('8', 'Taco', 'Mexican', 'taco', 'Lunch,Dinner', 'Appetizer', 'taco.jpg');
COMMIT;

-- ----------------------------
--  Table structure for `customer`
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `customer_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `customer_first_name` varchar(100) NOT NULL,
  `customer_last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address1` varchar(200) NOT NULL,
  `address2` varchar(200) DEFAULT NULL,
  `city` varchar(150) DEFAULT NULL,
  `zip` bigint(20) unsigned NOT NULL,
  `password` varchar(100) NOT NULL,
  `security_question` varchar(300) DEFAULT NULL,
  `security_answer` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `customer`
-- ----------------------------
BEGIN;
INSERT INTO `customer` VALUES ('1', 'Jyotirmay', 'Banerjee', 'jyoti505@gmail.com', '4087072543', 'Address', 'address2', 'SantaClara', '95051', 'password', 'what is mobile number', 'karu kya dial number'), ('2', 'Jyomay', 'Banerjee', 'jyot05@gmail.com', '408972543', 'Address', 'address2', 'SantaClara', '95051', 'password', 'what is mobile number', 'karu kyl number'), ('3', 'Manami', 'Bhunia', 'manami1@gmail.com', '1234567890', '23 Agate dr', 'hjk', 'Santa Clara', '95051', 'manami28', 'who are you', 'manami'), ('4', 'Manami', 'Bhunia', 'manami2@gmail.com', '1234567890', '23 Agate dr', 'hjk', 'Santa Clara', '95051', 'manami28', 'who are you', 'manami');
COMMIT;

-- ----------------------------
--  Table structure for `order_details`
-- ----------------------------
DROP TABLE IF EXISTS `order_details`;
CREATE TABLE `order_details` (
  `order_id_fk` bigint(20) unsigned NOT NULL,
  `cuisine_id_fk` bigint(20) unsigned NOT NULL,
  `quantity` bigint(20) unsigned DEFAULT NULL,
  `price` bigint(20) unsigned DEFAULT NULL,
  KEY `order_id_fk` (`order_id_fk`),
  KEY `cuisine_id_fk` (`cuisine_id_fk`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id_fk`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`cuisine_id_fk`) REFERENCES `cuisine` (`cuisine_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `orders`
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id_fk` bigint(20) unsigned NOT NULL,
  `caterer_id_fk` bigint(20) unsigned NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `order_status` varchar(20) DEFAULT 'processing',
  `total_price` double DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT 'paid',
  `note` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `customer_id_fk` (`customer_id_fk`),
  KEY `caterer_id_fk` (`caterer_id_fk`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id_fk`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`caterer_id_fk`) REFERENCES `caterer` (`caterer_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `price`
-- ----------------------------
DROP TABLE IF EXISTS `price`;
CREATE TABLE `price` (
  `cuisine_id_fk` bigint(20) unsigned NOT NULL,
  `caterer_id_fk` bigint(20) unsigned NOT NULL,
  `item_price` varchar(100) DEFAULT NULL,
  KEY `cuisine_id_fk` (`cuisine_id_fk`),
  KEY `caterer_id_fk` (`caterer_id_fk`),
  CONSTRAINT `price_ibfk_1` FOREIGN KEY (`cuisine_id_fk`) REFERENCES `cuisine` (`cuisine_id`) ON DELETE CASCADE,
  CONSTRAINT `price_ibfk_2` FOREIGN KEY (`caterer_id_fk`) REFERENCES `caterer` (`caterer_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `price`
-- ----------------------------
BEGIN;
INSERT INTO `price` VALUES ('2', '3', '3.50'), ('3', '2', '8.90'), ('8', '2', '6');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
