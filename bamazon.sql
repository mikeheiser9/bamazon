CREATE TABLE products (
id INTEGER NOT NULL,
PRIMARY KEY (id),
product_name VARCHAR (50) NOT NULL,
department_name VARCHAR (50),
price DECIMAL(4,2) NOT NULL,
stock_quantity INTEGER NOT NULL
);