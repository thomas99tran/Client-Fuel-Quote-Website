const jwt = require("jsonwebtoken")
const data = require("./data")

const jwtKey = "my_secret_key"
const jwtExpiresSeconds = 300

const signIn = async (req,res, next) => {
    const {username, password } = req.body

    /*if (!username || !password || users[username] !== password) {
        return res.status(401).end()
    }*/

    if (!username || !password || data[username] === undefined || data[username].password !== password) {
        return res.status(401).end()
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