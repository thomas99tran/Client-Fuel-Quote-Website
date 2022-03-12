const express = require('express');
const app = express();
const path = require('path');
const handlebars = require("express-handlebars")
const cookieParser = require("cookie-parser")
const hard_coded_data = require("./data")
const schemas = require("./models")

const request_handler = require("./handler")
const router = express.Router();

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));

router.get('/', request_handler.check_token, function(req,res){
    res.render("login", {layout: "layout_login"})
});

router.get('/register',function(req,res){
    res.render("register", {layout: "layout_login"})
});

router.get("/account", function (req, res){
    res.render("account", {layout: "layout_account_and_fuelquote_form.handlebars"})
});
router.get("/f-quote-form", function (req, res){
    const payload = request_handler.get_token_payload(req.cookies.token)
    if (payload === null)
        res.redirect(401,"/")
    let address = ""
    if (hard_coded_data[payload.username].address )
        address = hard_coded_data[payload.username].address
    else if (hard_coded_data[payload.username].address_two)
        address = hard_coded_data[payload.username].address_two

    data = {
        suggested_price: 5,
        address: address
    }
    res.render("fuelquoteform", {layout: "layout_account_and_fuelquote_form.handlebars", data})
});
router.get("/f-quote-history", function (req, res){
    const payload = request_handler.get_token_payload(req.cookies.token)
    if (payload === null)
        res.redirect(401, "/")
    
    res.render("fuelquotehistory", {layout: "layout_fuelquote_history.handlebars", data:hard_coded_data[payload.username].fuels})
});


router.post('/account', (req, res) => {
    const {error, value} = schemas.accountSchema.validate(req.body)
    if (error)
        res.status(422).send(error)
    
    const {fullName, Address1, Address2, City, states, Zipcode} = value
    const payload = request_handler.get_token_payload(req.cookies.token)
    if (payload === null)
        res.redirect(401, "/")
    
    hard_coded_data[payload.username]["fullName"] = fullName
    hard_coded_data[payload.username]["address"] = Address1
    hard_coded_data[payload.username]["address_two"] = Address2
    hard_coded_data[payload.username]["city"] = City
    hard_coded_data[payload.username]["state"] = states
    hard_coded_data[payload.username]["zipcode"] = Zipcode

    res.redirect("/f-quote-form")
})

router.post('/f-quote-form', (req, res) => {
    const {value, error} = schemas.fuelSchema.validate(req.body)
    
    if(error)
        res.status(422).send(error)

    const {gallons, deliveryAddress, deliveryDate, price, total} = req.body
    const payload = request_handler.get_token_payload(req.cookies.token)
    if (payload === null) 
        res.redirect(401, "/")
    
    hard_coded_data[payload.username].fuels.push({
        gallons: gallons,
        deliveryAddress: deliveryAddress,
        deliveryDate: deliveryDate,
        price: price,
        total: total
    })

    res.redirect("/f-quote-history")
})

router.post("/login", request_handler.signIn, (req, res, next) => {
    const {error, value} = schemas.userSchema.validate(req.body)

    if (error)
        res.status(422).send(error)

    if(hard_coded_data[req.body.username] === undefined)
        res.status(400).send()
    else if(hard_coded_data[req.body.username].fullName !== undefined)
        res.redirect("/f-quote-form")
    else
        res.redirect(200, "/account")
})

router.post("/register", (req, res, next) => {
    const {error, value} = schemas.userSchema.validate(req.body)
    if (error)
        res.status(422).send(error)

    if (hard_coded_data[req.body.username] !== undefined)
        res.status(400).send("User already exist")
    else {
        hard_coded_data[req.body.username] = {
            password: req.body.password,
            fuels: []
        }
        res.redirect("/")
    }
 
    
})


//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log(`http://localhost:3000`);
module.exports = app