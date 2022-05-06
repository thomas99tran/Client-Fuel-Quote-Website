const chai = require("chai")
const chaiHttp = require("chai-http")

const should = chai.should()

chai.use(chaiHttp)

const server = require("../app")
const db = require("../database/connect")
const user = require("../database/tables/user")
const fuel = require("../database/tables/fuel")
const account = require("../database/tables/account")


describe("DB Connection Test", () => {
    it("Connect DB", done => {
        
    
        db.connect()
        .then(() => {
            console.log("Connection DB success")
            user.user.sync({force: true}).then(() => console.log("Reset user table"))
            account.account.sync({force: true}).then(() => console.log("Reset account table"))
            fuel.fuel.sync({force: true}).then(() => console.log("Reset fuel table"))
            done()

        })
        .catch((reason) => {
            console.log(error)
        })
   
        
    })
})


let token, status;
describe("Register and Login Test", () => {

    before(done => {
        chai.request(server)
            .post("/register")
            .send({username: "user", password: "user"})
            .end((error, response) => {
                response.should.have.status(200)
                console.log("Redirect to login page")
                done()
            })
    })
    
    it("GET: login page", done => {
        chai.request(server)
            .get("/")
            .end((error, response) => done())
    });

    it("POST login", done => {
        chai.request(server)
            .post("/login")
            .send({username: "user", password: "user"})
            .end((error, response) => {
                response.header.should.be.a("object")
                response.header.should.be.property("set-cookie")
                response.should.have.status(200)
                if (!error){
                    token = response.header['set-cookie'][0]
                    status = response.status
                    console.log(`Token : ${token}\nStatus : ${status}`)
                }
                else {
                    console.log("something went wrong")
                }
                done()
            })
    })
})



describe("First register and Account Management Tests", () => {

    before(done => {
        console.log("Before register the system")
        chai.request(server)
            .post("/register")
            .send({username: "test", password: "test"})
            .end((error, response) => {
                response.should.have.status(200)
                console.log("Redirect to login page")
                done()
            })
    })

    it("POST login", done => {
        chai.request(server)
            .post("/login")
            .send({username: "test", password: "test"})
            .end((error, response) => {
                response.header.should.be.a("object")
                response.header.should.be.property("set-cookie").a("array")
                response.should.have.status(200)
                console.log("Redirect to account page")
                if (!error){
                    token = response.header['set-cookie'][0]
                    status = response.status
                    console.log(`Token : ${token}\nStatus : ${status}`)
                }
                else {
                    console.log("something went wrong")
                }
                done()
            })
    })

    it("Get account page", done => {
        chai.request(server)
            .get("/account")
            .set("Cookie", token)
            .end((error, response) => done())
    })

    it("Change account settings", done => {
        chai.request(server)
            .post("/account")
            .set("Cookie", token)
            .send({
                fullName: "testName",
                Address1: "testAddress",
                Address2: "testAddress2",
                City: "testCity",
                states: "AD",
                Zipcode: "testZipcode"
            })
            .end((error,response) => {
                response.should.have.status(200)
                done()
            })
    })
})


describe("Fuel Quota Form Test", () => {

    it("Add Fuel Quota", done => {
        chai.request(server)
            .post("/f-quote-form")
            .set("Cookie", token)
            .send({
                gallons: 5,
                deliveryAddress: "test",
                deliveryDate: "2022-03-14",
                price: 3,
                total: 15
            })
            .end((error,response) => {
                response.should.have.status(200)
                done()
            })
    })

    it("Get Fuel Quota Page", done => {
        chai.request(server)
            .get("/f-quote-form")
            .set("Cookie", token)
            .end((error, response) => {
                response.should.have.status(200)
                done()
            })
    })
})



describe("Fuel Quota History Test", () => {

    it("Get Fuel Quota History Page", done => {
        chai.request(server)
            .get("/f-quote-form")
            .set("Cookie", token)
            .end((error, response) => {
                response.should.have.status(200)
                done()
            })
    })
})