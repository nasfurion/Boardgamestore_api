import express from 'express'
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, schema } from '../lib/utility.js' 

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

    // Enforce password policy
    if (schema.validate(password)){
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
    } else {
        res.status(400).send('Password must be at least 8 characters long and must include a digit, an uppercase character and a lowercase character')
    }
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

    // Setup user session data
    req.session.email = existingUser.email
    req.session.customerId = existingUser.customer_id
    req.session.firstName = existingUser.first_name
    req.session.lastName = existingUser.last_name

    // Send response
    res.status(200).json({'user': email})
})

// LOGOUT
router.post('/logout', (req, res) => {
    // Destroy session
    req.session.destroy();

    // Send logout confirm
    res.send('Logout Successful')
})

// GET SESSION
router.get('/getSession', async(req, res) => {
    if (req.session.customerId){
        res.json({
            'id': req.session.customerId,
            'email': req.session.email,
            'firstName': req.session.firstName,
            'lastName': req.session.lastName
        })
    } else {
        res.status(401).send('Not logged in')
    }
})

export default router;