const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'secret')

    res.status(201).json({
        message: 'Você está autenticado.',
        token:token,
        userId: user._id,
    })
}

module.exports = createUserToken
