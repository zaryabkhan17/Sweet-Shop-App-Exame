const PORT = process.env.PORT || 5000;

var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var path = require('path');
var http = require('http');

var { SERVER_SECRET } = require("./core/app");
var { userModel, productModel, checkoutFormModel } = require("./dbrepo/models");
var authRoutes = require("./routes/auth");

//==========================================================================================
const multer = require("multer");
const storage = multer.diskStorage({ 
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
});
var upload = multer({ storage: storage });

//==========================================================================================

const admin = require("firebase-admin");
var serviceAccount = {
    
  "type": "service_account",
  "project_id": "exame-1428e",
  "private_key_id": "eacce521b085a850b6bc0139d5ba0d749a632ef3",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIHosoXHqLMnSn\nctOwlWNVSglLA4h1fm5/U0Eub10fp76nNvKnRU58pFQJLND6rGqbWyl/VutBgBF4\n+q4dw1+rk0h7HVy+lJuNFurOEu/5Eq58Uz+4jh1zU2Jfvb7EydPoyA4gm+FW2LDT\nm6aElRvwLRo/bUCOwsG2kKslLhHtPJftot6nMmaLEVmtnIQE/8/5h8KRCnzBnTXo\nVHbxmdVuK4WpYJ5TmQ6ALYPECt8hEj3kHVPNbABSKh63vvfQW0DNjXHC3KEhNc8j\nBYmYY2QTkrPRi5DWCufKVPCAJ8baeEQqfzwzMoQNLJS6P15Uvcb7jvwG21WQZTSo\nr73EquIdAgMBAAECggEADEMg3EWEZcSe9Ma6tXKF7ms1tBDAmxB29VrU3uNIhcDJ\n1CWwCzNaOpV4J8LFAGMxuhjFK24YRsBx8aOMqTq4QUNqWM7lCLGC8YuCskNjTHQK\nWIhiWmzs3YzxtXOjPZwvXa9qfDGJBoELHsBGHRAk8NvWpKXNY6IH7CejsQjIZOyq\nlnlZ1EVmAUuOLX8R4VJyCTIRop+cd3GYdwrpBobVG/HKsG1NDUU8BWIJ6G08H0pG\nzyXdIImgPxaebueAus0lgpqqUZ9yKlo6b2LpAZ/If2JzPyoJ2l0sw4/P1+yp0qRu\naLJmXTtyhG/cqhOJuN4F/EzBusWyJxRgZDmfmCeHMQKBgQDjQ3WydU9EN+GyHD+A\nx5bE9CqkeIUXdW30dYar5LK+1Sdp0T3qim7C9XptPDPeUuNfsb1BOPxHjK3dSQji\n3mSHv0XCaBwgatyv0MlctDjUBcQ+mIbEp2PgFrFb2vhI45bucqeX0CjdXM6z8nwC\n4ukD91y/kidfiaP2Jg2bwMSvbQKBgQDhbGxsluo1Y7WPoHTAR0lebXF22p78NDHw\nXesInri77dMPs7xKd8mNqG9FvSw3a7aZYnJqLV67AUI19MeKXgrIsK9w/VfCwM9L\nbaAHb8ISAvDLVx84byonUnLl/WXSggcuujqsG6ad+ofJW0PvkkupvDlfyXIxW/AF\nl4avO8BfcQKBgFgnGadQY5/VgUFCPcupH61j/IpxiUaRMUZqtANHIaJuMeyU0kyA\nx/ftmkB24rOxOSssWXnMLedfBS3Zn43Ir/wL0HZZRde5O8Mi3IiOC6EKX5XcOiJb\nv5zzkHZN2JMFXM0/QgzcHI3I6xDX1QyVkccNEzfn7EfdrvDSz+KDgod9AoGBAIOg\nx/7wcHoUauQfEY1lEtZsmaCJL+ScpbxxWtiBteUmjePRU9U39R0eiTrzp2oFH26Z\nKa4OKA6SQZM4B3woRavCX+9eP2ydIW4t6Q/ulifmR6y0hqpxXu/vGOBrApXVD1Sd\nsbzluHju3XMaM6Uki8HlAquH+YIQ6SqavC5+eWpBAoGBAJ/Gd6XST9ZDeAZ6hcKi\n6bAmm8fra/Ox+F3bxQuSBcMU/yW6wejhOkXMCYIK2J6hbP29/uDamSkMNOuAmjtQ\nl4MwKNZLVrdnDImrM/o5IUDeHVN4w95R+YgySZ7z/xBHu1SwFyWKAqjDB2iofeUh\nbv9yranlvK9bU8udCaCaD6Gk\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-2qqdu@exame-1428e.iam.gserviceaccount.com",
  "client_id": "105584734050225634208",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2qqdu%40exame-1428e.iam.gserviceaccount.com"};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://exame-1428e-default-rtdb.firebaseio.com/",
});
const bucket = admin.storage().bucket("gs://exame-1428e.appspot.com"); // Firebase bucket Link
//==========================================================================================

var app = express();
var server = http.createServer(app);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use("/", express.static(path.resolve(path.join(__dirname, "frontend/build"))));
app.use("/auth", authRoutes);

app.use(function (req, res, next) {
    console.log("req.cookies: ", req.cookies);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodeData) {
        if (!err) {

            const issueDate = decodeData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;

            if (diff > 300000) {
                res.send({
                    message: "Token Expired",
                    status: 401
                })
            }
            else { 
                var token = jwt.sign({
                    id: decodeData.id,
                    name: decodeData.name,
                    email: decodeData.email,
                    phone: decodeData.phone,
                    role: decodeData.role
                }, SERVER_SECRET)

                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });

                req.body.jToken = decodeData
                next();
            }
        }
        else {
            res.send({
                message: "Invalid token",
                status: 401
            })
        }
    });
});

app.get("/profile", (req, res, next) => {
    console.log(req.body);

    userModel.findById(req.body.jToken.id, 'name email phone createdOn role', function (err, doc) {
        if (!err) {
            res.send({
                profile: doc,
                status: 200
            })

        } else {
            res.send({
                message: "Server Error",
                status: 500
            });
        }
    });
});

app.post("/updateproducts", (req, res, next) => {
    if (!req.body.productName || !req.body.productPrice || !req.body.productImage || !req.body.productDescription || !req.body.productQuantity || !req.body.activeStatus) {
        res.status(403).send(`
            please send name, email, passwod and phone in json body.
            e.g:
            {
                "productName": "ABC",
                "productPrice": "100@gmail.com",
                "productImage": "Image URL",
                "productDescription": "This is amaizing",
                "productQuantity": "100",
                "activeStatus": "true or false",
            }`);
        return;
    }
    userModel.findById(req.body.jToken.id, 'email role', function (err, user) {
        if (!err) {
            if (user.role === "admin") {
                var newProduct = new productModel({
                    "productName": req.body.productName,
                    "productPrice": req.body.productPrice,
                    "productImage": req.body.productImage,
                    "productDescription": req.body.productDescription,
                    "productQuantity": req.body.productQuantity,
                    "activeStatus": req.body.activeStatus,
                });
                newProduct.save((err, data) => {
                    // console.log(data);
                    if (!err) {
                        res.send({
                            message: "Product Added",
                            status: 200,
                            data: data
                        });
                    }
                    else {
                        console.log(err);
                        res.send({
                            message: "Product creation error, " + err,
                            status: 500
                        });
                    }
                });
            }
            else {
                res.send({
                    message: "Only Admin Add Products",
                    status: 409
                });
            }
        }
        else {
            res.send({
                message: "Product already exist!",
                status: 409
            });
        }
    })
});

app.post("/upload", upload.any(), (req, res, next) => {  

    console.log("req.body: ", req.body);
    console.log("req.body: ", JSON.parse(req.body.myDetails));
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    bucket.upload(
        req.files[0].path,
        function (err, file, apiResponse) {
            if (!err) {
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        // res.send(urlData[0]);
                        res.send({
                            message: "Upload Successfully",
                            status: 200,
                            url: urlData[0]
                        });

                       

                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                            return;
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
});

app.get('/getProducts', (req, res, next) => {
    productModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
})

app.post("/checkout", (req, res, next) => {
    if (!req.body.name || !req.body.address || !req.body.phoneNumber) {
        res.status(403).send(`
            please send name, adress and phone in json body.
            e.g:
            {
                "name": "ABC",
                "address": "House# xx, Stree# xx, <Location> Near <Area>",
                "phoneNumber": "03xxxxxxxxx",
            }`);
        return;
    }
    userModel.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("Checkout Email Get ===> : ", req.body.jToken.email);
        if (!err) {
            checkoutFormModel.create({
                "name": req.body.name,
                "email": user.email,
                "phoneNumber": req.body.phoneNumber,
                "address": req.body.address,
                "status": "Is Review",
                "orders": req.body.orders,
                "totalPrice": req.body.totalPrice
            }).then((data) => {
                res.send({
                    status: 200,
                    message: "Order Done",
                    data: data
                })
            }).catch((err) => {
                res.send({
                    status: 500,
                    message: "Order Err" + err
                })
            })
        }
    })
});

app.get('/myOrder', (req, res, next) => {
    checkoutFormModel.find({ email: req.body.jToken.email }, (err, data) => {
        if (!err) {
            res.send({
                status: 200,
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
});

app.get('/getOrders', (req, res, next) => {
    checkoutFormModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                data: data
            })
        }
        else {
            res.send(err)
        }
    })
});

app.post('/updateStatus', (req, res, next) => {
    checkoutFormModel.findById({ _id: req.body.id }, (err, data) => {
        if (data) {
            data.updateOne({ status: req.body.status }, (err, update) => {
                if (update) {
                    res.send("Order Confirmed")
                }
                else {
                    res.send(err)
                }
            })
        }
        else {
            res.send(err)
        }
    })
})

app.post('/deleteStatus', (req, res, next) => {
    checkoutFormModel.findById({ _id: req.body.id }, (err, data) => {
        if (data) {
            data.updateOne({ status: req.body.status }, (err, update) => {
                if (update) {
                    res.send("Order Cancelled")
                }
                else {
                    res.send(err)
                }
            })
        }
        else {
            res.send(err)
        }
    })
});

app.get('/orderHistory', (req, res, next) => {
    checkoutFormModel.find({ status: {$in: ["Order Cancelled", "Order Confirmed"]} }, (err, data) => {
        if (data) {
            res.send({
                data: data
            })
        }
        else {
            res.send({
                message: "Error : ", err
            })
        }
    })
});

server.listen(PORT, () => {
    console.log("server is running on: ", PORT);
});