const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { verifyGoogleToken } = require('../utils/googleAuth');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body;
        const userExists = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO customers (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING customer_id, name, email',
            [name, email, phone, address, hashedPassword]
        );

        const token = jwt.sign(
            { userId: result.rows[0].customer_id, email: result.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ success: true, token, user: result.rows[0] });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.customer_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ success: true, token, user: { customer_id: user.customer_id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Google Login with optional profile info
router.post('/google-login', async (req, res) => {
    try {
        const { token, phone, address } = req.body;

        // Verify Google token
        const googleUser = await verifyGoogleToken(token);
        if (!googleUser) return res.status(400).json({ error: 'Invalid Google token' });

        // Check for existing user
        let result = await pool.query('SELECT * FROM customers WHERE email = $1', [googleUser.email]);
        let user = result.rows[0];

        if (!user) {
            // Create new user with optional phone/address
            const insertResult = await pool.query(
                'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
                [googleUser.name, googleUser.email, phone || null, address || null]
            );
            user = insertResult.rows[0];
        } else if ((!user.phone || !user.address) && phone && address) {
            // Update existing user if missing info and provided in request
            const updateResult = await pool.query(
                'UPDATE customers SET phone = $1, address = $2 WHERE customer_id = $3 RETURNING *',
                [phone, address, user.customer_id]
            );
            user = updateResult.rows[0];
        }

        // Create JWT
        const jwtToken = jwt.sign(
            { userId: user.customer_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const needsMoreInfo = !user.phone || !user.address;

        res.json({ success: true, token: jwtToken, user, needsMoreInfo });
    } catch (err) {
        console.error('Google auth error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Legacy Complete Profile endpoint (optional, for fallback)
router.post('/complete-profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Missing token' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { phone, address } = req.body;
        if (!phone || !address) return res.status(400).json({ error: 'Phone and address are required' });

        await pool.query(
            'UPDATE customers SET phone = $1, address = $2 WHERE customer_id = $3',
            [phone, address, decoded.userId]
        );

        res.json({ success: true, message: 'Profile completed successfully' });
    } catch (err) {
        console.error('Complete profile error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
