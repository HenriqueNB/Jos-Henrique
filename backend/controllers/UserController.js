const User = require('../models/User')
const bcrypt = require('bcryptjs')
const createUserToken = require('../helpers/create-user-token')

module.exports = class UserController {
    static async register(req, res) {
        const {name, email, password, phone, confirmpassword} = req.body

        if (!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }
        if (!email) {
            res.status(422).json({message: 'O email é obrigatório!'})
            return
        }
        if (!phone) {
            res.status(422).json({message: 'O telefone é obrigatório!'})
            return
        }
        if (!password) {
            res.status(422).json({message: 'A senha é obrigatória!'})
            return
        }
        if (!confirmpassword) {
            res.status(422).json({message: 'A confirmação de senha é obrigatória!'})
            return
        }
        if (password !== confirmpassword) {
            res.status(422).json({message: 'As senhas não conferem!'})
            return
        }
        const userExist = await User.findOne({email: email})

        if (userExist) {
            res.status(422).json({message: 'Email já cadastrado!'})
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            password: passwordHash,
            phone
        })

        try{
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        }
        catch(err) {
            res.status(503).json({message: 'Aconteceu um erro no servidor, tente novamente mais tarde!'})
        }
    }
}

