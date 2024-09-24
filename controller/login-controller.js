const express = require('express')
const router = express.Router()

router.post('/login',
  async (req, res) => {
    const response = {
        status: 200,
        data: 'faz login'
    }        
    res.status(response.status).json(response.data)
}
)

module.exports = router