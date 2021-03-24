var mongoose = require('mongoose');

let dbURI = "mongodb+srv://chaters:1111@zar.r0ctt.mongodb.net/DBase?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function () { //connected
    console.log("Mongoose in connected");
});

mongoose.connection.on('disconnected', function () { //disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) { //any error
    console.log("Mongoose connection error: ", err);
    process.exit(1);
})

process.on('SIGINT', function () {//this function will run jst before app is closing
    console.log("App is terminating");
    mongoose.connection.close(function () {
        console.log("Mongoose default connection closed");
        process.exit(0);
    });
});

var userSchema = new mongoose.Schema({
    "name": String,
    "email": String,
    "password": String,
    "phone": String,
    "role": { "type": String, "default": "user" },
    "createdOn": { "type": Date, "default": Date.now },
    "activeSince": Date
});

var userModel = mongoose.model("users", userSchema);

var productSchema = new mongoose.Schema({
    "productName": String,
    "productPrice": String,
    "productImage": [],
    "productDescription": String,
    "productQuantity": String,
    "activeStatus": String
});

var productModel = mongoose.model("products", productSchema);

var checkoutFormSchema = new mongoose.Schema({
    "name": String,
    "email": String,
    "address": String,
    "phoneNumber": String,
    "status": String,
    "orders": Array,
    "totalPrice": String,
    "createdOn": { "type": Date, 'default': Date.now }
});

var checkoutFormModel = mongoose.model("checkoutForm", checkoutFormSchema);

module.exports = {
    userModel: userModel,
    productModel: productModel,
    checkoutFormModel: checkoutFormModel
}