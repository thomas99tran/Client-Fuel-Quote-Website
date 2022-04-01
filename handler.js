const jwt = require("jsonwebtoken")
const user = require("./database/tables/user")

const jwtKey = "my_secret_key"
const jwtExpiresSeconds = 300

const signIn = async (req,res, next) => {
    const {username, password } = req.body

    /*if (!username || !password || users[username] !== password) {
        return res.status(401).end()
    }*/

    let check = await user.user.findOne({
        where: {
            username: req.body.username
        }
    })

    if (!username || !password || check.username === null || !user.matchesPassword(check.password, password)) {
        return res.status(401).end("Wrong username or password")
    }

    const token = await  jwt.sign({username}, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpiresSeconds
    })

    res = res.cookie("token", token, {
        maxAge: jwtExpiresSeconds * 1000
    })

    return next()
}

const get_token_payload = (token) => {
    try {
        payload = jwt.verify(token, jwtKey)
        return payload
    } catch (error) {
        return null
    }
}

const check_token = (req, res, next) => {
    const token = req.cookies.token

    if(!token)
        return next()

    var payload
    try {
        payload = jwt.verify(token, jwtKey)
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError)
            return res.status(401).end()
        
        return res.status(400).end()
    }

    return res.redirect("/account")
}

module.exports = {
    signIn,
    check_token,
    get_token_payload
}