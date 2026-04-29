const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createUserToken = require('../helpers/create-user-token')
const getTokens = require('../helpers/get-tokens')

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

    static async login(req, res) {
        const {email, password} = req.body

        if (!email) {
            res.status(422).json({message: 'O email é obrigatório!'})
            return
        }
        if (!password) {
            res.status(422).json({message: 'A senha é obrigatória!'})
            return
        }

        const user = await User.findOne({email: email})

        if (!user) {
            res.status(401).json({message: 'Usuário não encontrado!'})
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({message: 'Senha inválida!'})
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser

        console.log(req.headers.authorization)
        if (req.headers.authorization) {
            const token = getTokens(req)
            const decoded = jwt.verify(token, 'secret')

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).json(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id)

        if(!user) {
            res.status(404).json({
                massage: 'Usuário não encontrado!'
            })
            return
        }
        res.status(200).json(user)
    }

    static async editUser(req, res) {
        res.status(200).json({
            massage: 'Usuário editado com sucesso!'
        })
    }
}

