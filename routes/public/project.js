const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const { User, Blog, Tag } = require('../../sequelize')

router.get('/', async function (req, res, next) {
    try {
      const size = req.query.size ? + req.query.size : 25;
      const page = req.query.page ? (req.query.page - 1) * size : 0;
      const project = await Tag.findAll({ limit: parseInt(size),
        offset: parseInt(page),
        order: [['updatedAt', 'DESC']]});
      if (project.length !== 0) {
        project.map(val=> {
            if(val.image) {
                val.image = `http://localhost:3000/images/${val.image}`
            }
        })
        res.json({
          'status': 'OK',
          'messages': '',
          'data': project
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

router.get('/:id', async (req,res,next) => {
    try {
        const project = await Tag.findAll({where: {
            id: req.params.id
        }});
        if (project.length !== 0) {
          project.map(val=> {
              if(val.image) {
                  val.image = `http://localhost:3000/images/${val.image}`
              }
          })
          res.json({
            'status': 'OK',
            'messages': '',
            'data': project[0]
          })
        } else {
          res.json({
            'status': 'ERROR',
            'messages': 'EMPTY',
            'data': {}
          })
        }
      } catch (err) {
        console.log(err)
        res.json({
          'status': 'ERROR',
          'messages': err.messages,
          'data': {}
        })
      }
})

module.exports = router;