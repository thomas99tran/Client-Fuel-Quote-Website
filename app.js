const express = require('express');
const app = express();
const path = require('path');
const handlebars = require("express-handlebars")
const cookieParser = require("cookie-parser")
const hard_coded_data = require("./data")
const schemas = require("./models")

const request_handler = require("./handler")
const db = require("./database/connect")
const user = require("./database/tables/user")
const fuel = require("./database/tables/fuel")
const account = require("./database/tables/account")

const router = express.Router();

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));

db.connect()

router.get('/', request_handler.check_token, function(req,res){
    res.render("login", {layout: "layout_login"})
});

router.get('/register',function(req,res){
    res.render("register", {layout: "layout_login"})
});

router.get("/account", function (req, res){
    res.render("account", {layout: "layout_account_and_fuelquote_form.handlebars"})
});
router.get("/f-quote-form",  async (req, res) => {
    const payload = request_handler.get_token_payload(req.cookies.token)
    if (payload === null)
        res.redirect(401,"/")
    
    let check = await user.user.findOne({
        where: {
            username: payload.username
        }, 
        include: account.account
    })

    let address = check.Account.Address1
    if (!address)
        address = check.Account.Address2
    
    data = {
        suggested_price: 5,
        address: address
    }
    res.render("fuelquoteform", {layout: "layout_account_and_fuelquote_form.handlebars", data})
});
router.get("/f-quote-history", async (req, res) => {
    const payload = request_handler.get_token_payload(req.cookies.token)
    if (payload === null)
        return res.redirect(401, "/")
    
    let check = await  user.user.findOne({
        where: {
            username: payload.username
        },
        include: fuel.fuel
    })

    res.render("fuelquotehistory", {layout: "layout_fuelquote_history.handlebars", data: check.Fuels})
});


router.post('/account', async (req, res) => {
    const {error, value} = schemas.accountSchema.validate(req.body)
    if (error)
        return res.status(422).send(error)
    
    const {fullName, Address1, Address2, City, states, Zipcode} = value
    const payload = request_handler.get_token_payload(req.cookies.token)
    if (payload === null)
        res.redirect(401, "/")
    
    let check = await user.user.findOne({
        where: {
            username: payload.username
        }
    })

    let result = await account.account.create({
        fullName: fullName,
        Address1: Address1,
        Address2: Address2,
        City: City,
        states: states,
        Zipcode: Zipcode,
        UserId: check.id
    })


    res.redirect("/f-quote-form")
})

router.post('/f-quote-form', async (req, res) => {
    const {value, error} = schemas.fuelSchema.validate(req.body)
    
    if(error)
        return res.status(422).send(error)

    const {gallons, deliveryAddress, deliveryDate, price, total} = req.body
    const payload = request_handler.get_token_payload(req.cookies.token)
    if (payload === null) 
        return res.redirect(401, "/")
    
    let check = await user.user.findOne({
        where: {
            username: payload.username
        },
        include: account.account
    })

    await fuel.fuel.create({
        gallons: gallons,
        deliveryAddress: deliveryAddress,
        deliveryDate: deliveryDate,
        price: price,
        total: total,
        UserId: check.id
    })

    res.redirect("/f-quote-history")
})

router.post("/login", request_handler.signIn, async (req, res, next) => {
    const {error, value} = schemas.userSchema.validate(req.body)

    if (error)
        res.status(422).send(error)

    let check = await user.user.findOne({
        where: {
            username: req.body.username
        },
        include: account.account
    })

    if(check === null)
        res.status(400).send()
    else if(check.Account !== null)
        res.redirect("/f-quote-form")
    else
        res.redirect(200, "/account")
})

router.post("/register", async (req, res, next) => {
    const {error, value} = schemas.userSchema.validate(req.body)
    if (error)
        res.status(422).send(error)
    let result = await user.user.findOne({
        where: {
            username: req.body.username
        }
    })


    if (result !== null)
        res.status(400).send("User already exist")
    else {
        await user.user.create({
            username: req.body.username,
            password: await user.hashPassword(req.body.password)
 
        })
        res.redirect("/")
    }
 
    
})


//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log(`http://localhost:3000`);
module.exports = app