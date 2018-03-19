var mysql = require("mysql");
var inquirer = require("inquirer");
var data;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //   console.log(res);
        data = res;
        start();
    });
}

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("--------------------------------------------------------------------");
    });
}

function start() {
    var string = [];
    for (i = 0; i < data.length; i++) {
        string.push(data[i].product_name);
    }
    inquirer.prompt([{
                name: "pickProduct",
                type: "list",
                message: "What product are you interested in?",
                choices: string
            },
            {
                name: "pickQuantity",
                message: "How many would you like to purchase?"
            },
        ])
        .then(function (answer) {
            var product;
            console.log(answer.pickProduct);
            for (i = 0; i < data.length; i++) {
                if (answer.pickProduct === data[i].product_name) {
                    product = data[i];
                }
            }
            if (answer.pickQuantity <= product.stock_quantity) {
                console.log("--------------------------------------------------------------------");
                console.log("--------------------------------------------------------------------");
                console.log("You have " + answer.pickQuantity + " of " + answer.pickProduct + " in your cart:" + " TOTAL PRICE: $" + product.price * answer.pickQuantity);
                console.log("--------------------------------------------------------------------");
                console.log("--------------------------------------------------------------------");
                confirmPurchase(answer.pickQuantity, answer.pickProduct, product.price, product.stock_quantity);
            } else {
                console.log("--------------------------------------------------------------------");
                console.log("--------------------------------------------------------------------");
                console.log("Sorry there is not enough stock to fulfill your order")
                console.log("--------------------------------------------------------------------");
                console.log("--------------------------------------------------------------------");
                start();
            }

        })
}

function confirmPurchase(quan, pickPro, price, stock) {
    inquirer.prompt([{
        name: "confirmPurchase",
        type: "confirm",
        message: "Would you like to place your order?"
    }
])
    .then(function (answer) {
        if (answer.confirmPurchase === true) {
            console.log("---------------------------------")
            console.log("Congrats Your purchase is complete!")
            console.log("Order Summary: " + quan + " of " + pickPro + " TOTAL PRICE: $" + price * quan);
            console.log("---------------------------------")
            connection.query("UPDATE products SET ? WHERE ?",   [
                {
                  stock_quantity: stock - quan
                },
                {
                  product_name: pickPro
                }
              ])   
        }
        start();
       
    })
};