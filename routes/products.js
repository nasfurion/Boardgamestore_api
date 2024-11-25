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
    if (req.session.customerId) {
        // Get purchase details
        const { street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart, invoice_amt, invoice_tax, invoice_total } = req.body;
        
        // Validate Inputs
        if ( !street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart || !invoice_amt || !invoice_tax || !invoice_total ) {

            return res.status(400).send('Missing required fields.'); 
        }

        // Process the cart
        const productArray = cart.split(",");
        
        const processedCart = productArray.reduce((acc, curr) => {
            const product = acc.find(item => item.product_id === parseInt(curr));

            if (product) {
                product.quantity += 1
            } else {
                acc.push({
                    'product_id': parseInt(curr),
                    'quantity': 1
                })
            }

            return acc;
        }, []);


        const purchase = await prisma.purchase.create({
            data: {
                customer_id: req.session.customerId,
                street: street,
                city: city,
                province: province,
                country: country,
                postal_code: postal_code,
                credit_card: parseInt(credit_card),
                credit_expire: credit_expire,
                credit_cvv: parseInt(credit_cvv),
                invoice_amt: parseFloat(invoice_amt),
                invoice_tax: parseFloat(invoice_tax),
                invoice_total: parseFloat(invoice_total),
            }
        })
        
        for ( const item of processedCart) {
            const purchaseItem = await prisma.purchaseItem.create({
                data: {
                    purchase_id: purchase.purchase_id,
                    product_id: item.product_id,
                    quantity: item.quantity
                }
            })
        }

        res.send(purchase)

    } else {
        res.status(401).send('Not logged in')
    }
})

export default router