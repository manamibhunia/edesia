CREATE DATABASE cmpe226;

DROP TABLE IF EXISTS caterer;
CREATE TABLE caterer(
  caterer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  caterer_name VARCHAR(200) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(15) NOT NULL,
  address1 VARCHAR(200) NOT NULL,
  address2 VARCHAR(200),
  city VARCHAR(150),
  state VARCHAR(150),
  zip BIGINT UNSIGNED NOT NULL,
  cuisine_type VARCHAR(50) NOT NULL
) ENGINE=INNODB;

DROP TABLE IF EXISTS customer;
CREATE TABLE customer(
  customer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_first_name VARCHAR(100) NOT NULL,
  customer_last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  address1 VARCHAR(200) NOT NULL,
  address2 VARCHAR(200),
  city VARCHAR(150),
  zip BIGINT UNSIGNED NOT NULL,
  password VARCHAR(100) NOT NULL,
  security_question VARCHAR(300),
  security_answer VARCHAR(100)
) ENGINE=INNODB;

DROP TABLE IF EXISTS cuisine;
CREATE TABLE cuisine (
  cuisine_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cuisine_name VARCHAR(100),
  cuisine_type VARCHAR(30),
  ingredients VARCHAR(200),
  cuisine_serving_time VARCHAR(500),
  cuisine_category VARCHAR(500)
) ENGINE=INNODB;

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  order_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id_fk BIGINT UNSIGNED NOT NULL,
  caterer_id_fk BIGINT UNSIGNED NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivery_date TIMESTAMP,
  order_status VARCHAR(20) DEFAULT 'processing',
  total_price DOUBLE,
  payment_status VARCHAR(20) DEFAULT 'paid',
  note VARCHAR(500),
  FOREIGN KEY (customer_id_fk) REFERENCES customer(customer_id) ON DELETE CASCADE,
  FOREIGN KEY (caterer_id_fk) REFERENCES caterer(caterer_id) ON DELETE CASCADE
) ENGINE=INNODB;

DROP TABLE IF EXISTS price;
CREATE TABLE price (
  cuisine_id_fk BIGINT UNSIGNED NOT NULL,
  caterer_id_fk BIGINT UNSIGNED NOT NULL,
 FOREIGN KEY (cuisine_id_fk) REFERENCES cuisine(cuisine_id) ON DELETE CASCADE,
 FOREIGN KEY (caterer_id_fk) REFERENCES caterer(caterer_id) ON DELETE CASCADE,
  price VARCHAR(100)
) ENGINE=INNODB;


DROP TABLE IF EXISTS order_details;
CREATE TABLE order_details (
  order_id_fk BIGINT UNSIGNED NOT NULL,
  cuisine_id_fk	BIGINT UNSIGNED NOT NULL,
  quantity BIGINT UNSIGNED,
  FOREIGN KEY (order_id_fk) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (cuisine_id_fk) REFERENCES cuisine(cuisine_id) ON DELETE CASCADE
) ENGINE=INNODB;
