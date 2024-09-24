const express = require('express')
const router = express.Router()

router.get('/', 
    async (req, res) => {
        const response = {
            status: 200,
            data: 'retorna o menu'
        }        
        res.status(response.status).json(response.data)
    }
)

router.get('/:id', 
    async (req, res) => {
        const response = {
            status: 200,
            data: 'retorna o item'
        }        
        res.status(response.status).json(response.data)
    }
)

router.post('/', 
    async (req, res) => {
        const response = {
            status: 200,
            data: 'cadastra o item'
        }        
        res.status(response.status).json(response.data)
    }
)

module.exports = router