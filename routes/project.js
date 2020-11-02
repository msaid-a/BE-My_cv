const path = require('path')
const multer = require('multer')
const router = require('express').Router()
const {
    User,
    Blog,
    Tag
} = require('../sequelize')
const fs = require('fs')

const avatarDirectory = path.join(__dirname, '../public/images')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, avatarDirectory)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
            cb(new Error('Format file harus jpg/jpeg/png'))
        }
        cb(null, true)
    }
})

router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const {
            name,
            text,
        } = req.body;

        const project = await Tag.create({
            name,
            text,
            image: req.file.filename
        });
        if (project) {
            res.status(201).json({
                'status': 'OK',
                'messages': 'User berhasil ditambahkan',
                'data': project,
            })
        }

    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': err.message,
            'data': {},
        })
    }
})

router.post('/', async function (req, res, next) {
    try {
        const {
            user_name,
            email,
            password,
        } = req.body;
        const password_hash = bcrypt.hashSync(password, 8)
        const users = await User.create({
            user_name,
            email,
            password: password_hash
        });

        if (users) {
            res.status(201).json({
                'status': 'OK',
                'messages': 'User berhasil ditambahkan',
                'data': users,
            })
        }
    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': err.message,
            'data': {},
        })
    }
});

// UPDATE users

router.patch('/:id', upload.single('image'), async (req, res, next) => {
    try {
        const {
            name,
            text
        } = req.body;
        const projectImage = await Tag.findAll({
            where: {
                id: req.params.id
            }
        });

        if (req.file.filename && projectImage[0].image) {
            fs.unlinkSync(avatarDirectory + '/' + projectImage[0].image)
        }

        const project = await Tag.update({
            name,
            text,
            image: req.file.filename
          }, {
            where: {
              id: req.params.id
            }
          });

        if (project) {
            res.json({
                'status': 'OK',
                'messages': 'project berhasil diupdate',
                'data': project,
            })
        }
    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': err.message,
            'data': {},
        })
    }
});



module.exports = router