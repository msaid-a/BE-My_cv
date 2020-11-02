const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const { User, Blog, Tag } = require('../../sequelize')
const jwt = require('jsonwebtoken')
const path = require('path')
const avatarDirectory = path.join(__dirname, '../../public/images/')
// Login 
router.post('/login', async (req,res,next) => {
    try {
      const {
        user_name,
        email,
        password,
      } = req.body;
      let users
      if(user_name){
         users = await User.findAll({where : {
          user_name: user_name,
        }});
      }else if (email) {
         users = await User.findAll({where : {
          email: email,
        }});
      }
  
      if(users) {
        let hasil =  await bcrypt.compare(password, users[0].password)      
        if(hasil) {
          let token = jwt.sign({ id: users[0].id, user_name: users[0].user_name }, 'asdasd', { expiresIn: 10000 }); // Sigining the token
          res.json({
            'status': 'OK',
            'messages': 'Login Success',
            'data': {
              id: users[0].id,
              user_name: users[0].user_name,
              jwt_token: token
            },
          })
        }else {
          res.json({
            'status': 'OK',
            'messages': 'Users tidak di temukan',
          })
        }
      }
    } catch (error) {
      
    }
  })


  router.get('/images/:filename',(req,res)=>{
    let directory = {
        root : avatarDirectory
    }
    console.log(directory)
    let fileName = req.params.filename
    res.sendFile(fileName, directory, function(err){  
        if(err) return res.send({error:err})
    })
})

module.exports = router;