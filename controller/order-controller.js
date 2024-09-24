const express = require('express')
const router = express.Router()

router.get('/', 
    async (req, res) => {
        const response = {
            status: 200,
            data: 'retorna os pedidos'
        }        
        res.status(response.status).json(response.data)
    }
)

router.get('/:id', 
    async (req, res) => {
        const response = {
            status: 200,
            data: 'retorna o pedido'
        }        
        res.status(response.status).json(response.data)
    }
)

router.post('/', 
    async (req, res) => {
        const response = {
            status: 200,
            data: 'faz o pedido'
        }        
        res.status(response.status).json(response.data)
    }
)

module.exports = router