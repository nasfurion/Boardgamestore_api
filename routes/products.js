import express from 'express'

const router = express.Router()

//GET ALL
router.get('/all', async(req, res) => {
    console.log('Get all')
    res.send('get all')
})

//GET BY ID
router.get('/:id', async(req, res) =>{
    const id = req.params.id;
    console.log(`Get id ${id}`)
    res.send(`Get id ${id}`)
})

//PURCHASE
router.post('/purchase', async(req, res) => {

})

export default router