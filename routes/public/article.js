const express = require('express');
const router = express.Router();
const { Blog } = require('../../sequelize')

router.get('/', async function (req, res, next) {
    try {
      const size = req.query.size ? + req.query.size : 25;
      const page = req.query.page ? (req.query.page - 1) * size : 0;

      const article = await Blog.findAll({
        limit: parseInt(size),
        offset: parseInt(page),
        order: [['updatedAt', 'DESC']]});
      if (article.length !== 0) {
        article.map(val=> {
            if(val.image) {
                val.image = `http://localhost:3000/images/${val.image}`
            }
        })
        res.json({
          'status': 'OK',
          'messages': '',
          'data': article
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
        const article = await Blog.findAll({where: {
            id: req.params.id
        }});
        if (article.length !== 0) {
          article.map(val=> {
              if(val.image) {
                  val.image = `http://localhost:3000/images/${val.image}`
              }
          })
          res.json({
            'status': 'OK',
            'messages': '',
            'data': article[0]
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
})

module.exports = router;