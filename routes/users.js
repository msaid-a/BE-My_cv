const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const { User, Blog, Tag } = require('../sequelize')
const jwt = require('jsonwebtoken')
// GET users listing.


router.get('/', async function (req, res, next) {
  try {
    const users = await User.findAll({});
    if (users.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': users
      })
    } else {
      res.json({
        'status': 'ERROR',
        'messages': 'EMPTY',
        'data': {}
      })
    }
  } catch (err) {
    res.json({
      'status': 'ERROR',
      'messages': err.messages,
      'data': {}
    })
  }
});

// POST users

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

router.patch('/:id', async (req, res, next) => {
  try {
    const usersId = req.params.id;
    const {
      user_name,
      email,
      password
    } = req.body;
    let password_hash = password
    if(password) {
      password_hash = bcrypt.hashSync(password, 8)
    } 
    const users = await User.update({
      user_name,
      email,
      password: password_hash
    }, {
      where: {
        id: usersId
      }
    });
    if (users) {
      res.json({
        'status': 'OK',
        'messages': 'User berhasil diupdate',
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

// DELETE users

router.delete('/:id', async (req, res, next) => {
  try {
    const usersId = req.params.id;
    const users = await User.destroy({ where: {
      id: usersId
    }})
    if (users) {
      res.json({
        'status': 'OK',
        'messages': 'User berhasil dihapus',
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




module.exports = router;