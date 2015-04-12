CREATE TABLE cusine (
  cusine-id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cusine-name VARCHAR(100),
  cusine-type VARCHAR(30),
  ingredients VARCHAR(200),
  note VARCHAR(500)
) ENGINE=INNODB;

CREATE TABLE order (
  order-id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer-id BIGINT UNSIGNED NOT NULL,
  caterer-id BIGINT UNSIGNED NOT NULL,
  order-date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivery-date DATETIME NOT NULL,
  order-status VARCHAR DEFAULT 'processing',
  total-price DOUBLE,
  payment-status VARCHAR DEFAULT 'paid',
  note VARCHAR(500)
  FOREIGN KEY (customer-id)
  REFERENCES customer(customer-id)
  ON DELETE CASCADE,
  FOREIGN KEY (caterer-id)
  REFERENCES caterer(caterer-id)
  ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE order-details (
  order-id BIGINT UNSIGNED,
  cusine-id	BIGINT UNSIGNED,
  quantity BIGINT UNSIGNED,
  price BIGINT UNSIGNED,
  FOREIGN KEY (order-id)
  REFERENCES order(order-id)
  ON DELETE CASCADE,
  FOREIGN KEY (cusine-id)
  REFERENCES cusine(cusine-id)
  ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE caterer(
  caterer-id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  caterer-name VARCHAR(200) NOT NULL,
  email VARCHAR(100),
  caterer-type VARCHAR(50) NOT NULL
) ENGINE=INNODB;

CREATE TABLE contact(
  contact-id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  phn-no VARCHAR(15) NOT NULL,
  address1 VARCHAR(200) NOT NULL,
  address2 VARCHAR(200),
  city VARCHAR(150),
  zip BIGINT UNSIGNED NOT NULL
) ENGINE=INNODB;

CREATE TABLE customer(
  customer-id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer-fname VARCHAR(100) NOT NULL,
  customer-lname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  security-question VARCHAR(300),
  security-answer VARCHAR(100)
) ENGINE=INNODB;
Chat Conversation End
