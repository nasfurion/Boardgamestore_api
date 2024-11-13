import express from 'express'
import cors from 'cors'
import productRouter from './routes/products.js'
import userRouter from './routes/users.js'


const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(cors())

//API ROUTES
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})