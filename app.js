import express from 'express'
import cors from 'cors'
import session from 'express-session'
import productRouter from './routes/products.js'
import userRouter from './routes/users.js'


const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Cors Setup
app.use(cors({
    credentials: true
}))

// Express Session Setup
app.use(session({
    secret: 'jsgfry1923987@$$@#34hj',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000
    }
}))

//API ROUTES
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})