const multer = require('multer')
const path = require('path')

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = ''

        if(req.baseUrl.includes('users')){
            folder = 'users'
        } else if (req.baseUrl.includes('pets')) {
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`)
    },
    filename: function (req, file, cb) {
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (file.originalname.match(/\.jpg|png$/)) {
            return cb(new error('Por favor, envie apenas images jpg ou png.'))
        }
        cb(undefined, true)
    }
})

module.exports = imageStorage