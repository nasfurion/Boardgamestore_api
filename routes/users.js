import express from 'express'
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js' 

const router = express.Router();

const prisma = new PrismaClient();

// SIGNUP
router.post('/signup', async(req, res) => {
    // Get user inputs
    const { email, password, firstName, lastName } = req.body;

    // Validate Inputs
    if ( !email || !password || !firstName || !lastName ) {
        return res.status(400).send('Missing required fields.'); 
    }

    // Check for existing user
    const existingUser = await prisma.customer.findUnique({
        where: {
            email: email,
        }
    });
    if (existingUser) {
        return res.status(400).send('User already exists.');
    }

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Add user to DB
    const user = await prisma.customer.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashedPassword
        }
    })

    // Send Response
    res.status(200).json({
        'user': email,
    })
})

// LOGIN
router.post('/login', async(req, res) => {
    // Get user inputs
    const { email, password} = req.body;

    // Validate Inputs
    if ( !email || !password ) {
        return res.status(400).send('Missing required fields.');
    }

    // Find user in DB
    const existingUser = await prisma.customer.findUnique({
        where: {
            email: email,
        }
    });
    if (!existingUser) {
        return res.status(404).send('User not found');
    }

    // Verify password
    const passwordMatch = await comparePassword(password, existingUser.password);
    if (!passwordMatch){
        return res.status(410).send('Invalid password')
    }

    // Send response
    res.status(200).json({'user': email})
})

// LOGOUT
router.post('/logout', async(req, res) => {
    console.log('Logout')
    res.send('Logout')
})

// GET SESSION
router.get('/getSession', async(req, res) => {
    console.log('getSession')
    res.send('getSession')
})

export default router;