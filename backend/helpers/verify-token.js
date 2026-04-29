const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {

    if (req.headers.authorization) {
        return res.status(401).json({
            massage: 'Acesso negado'
        })
    }

    const token = getToken(req)

    if (!token) {
        return res.status(401).json({
            message: 'Acesso negado'
        })
    }
    try {
        const verified = jwt.verify(token, 'secret')
        req.user = verified
        next()
    } catch (err) {
        res.status(400).json({
            message: 'Token inválido'
        })
    }
}

module.exports = checkToken