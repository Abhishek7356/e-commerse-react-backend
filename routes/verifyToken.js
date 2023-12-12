const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                res.status(500).json("web token is not valid!")
            } else {
                req.user = user;
                console.log(user);
                next()
            }
        })
    } else {
        res.status(500).json("you are not authenticated")
    }
}

const verifyWebTokenAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        next()
    })
}
const verifyWebTokenAuthForAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(500).json("you are not authenticated to access this")
        }
    })
}

module.exports = { verifyWebTokenAuth, verifyWebTokenAuthForAdmin }