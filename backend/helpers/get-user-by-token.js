const jwt = require('jsonwebtoken')
const User = require ('../models/User')

const getUserByToken = async (token) => {
    if (!token) {
        return null
    }

    const decoded = jwt.verify(token, 'secret')
    const userId = decoded.id
    const user = await User.findById({_id: userId})
    return user
}

module.exports = getUserByToken