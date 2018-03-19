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
            {
                name: "confirmPurchase",
                type: "confirm",
                message: "Would you like to place your order?"
            }
        ])
        .then(function (answer) {
            var product;

            for (i = 0; i < data.length; i++) {
                if (answer.pickProduct === data[i].product_name) {
                    product = data[i];
                    console.log(data[i]);
                }
            }
            if (answer.pickQuantity <= product.stock_quantity) {
                console.log("--------------------------------------------------------------------");
                console.log("--------------------------------------------------------------------");
                console.log("You are about to order " + answer.pickQuantity + " of " + answer.pickProduct + "for $" + answer.price * answer.pickQuantity);
                console.log("--------------------------------------------------------------------");
                console.log("--------------------------------------------------------------------");
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

function buy() {
    if (confirmPurchase){
        console.log("Congrats your order is confirmed!!")
    }
}
