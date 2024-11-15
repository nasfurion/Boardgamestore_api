import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})
//GET ALL
router.get('/all', async(req, res) => {
    const products = await prisma.product.findMany();

    res.json(products)
})

//GET BY ID
router.get('/:id', async(req, res) =>{
    const id = req.params.id;

    //Verify :id is a number
    if (isNaN(id)){
        res.status(400).send('Provide a valid ID.');
        return;
    }

    const product = await prisma.product.findUnique({
        where: {
            product_id: parseInt(id)
        }
    })
    
    if (product) {
        res.json(product);
    } else [
        res.status(404).send('Id not found')
    ]
})

//PURCHASE
router.post('/purchase', async(req, res) => {
    console.log('Purchase')
    res.send('Purchase')
})

export default router