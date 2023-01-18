const express = require('express');
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./verifyToken');

const router = express.Router();
  
// Check Unique Email

router.get('/check-email/:email', async (req,res) => {
    
    try {
        const email = await User.findOne({ email: req.params.email });

        if (email) {
            res.status(201).send('El correo electrónico ingresado ya existe');
        } else {
            res.status(200).send('Correo electrónico válido para registrarse');
        }
    } catch (err) {
        console.dir(err);
    }

});

// Register

router.post('/register', async (req,res) => {
    const user = await User.findOne({ username: req.body.username }); 
    
    if (user) {
        return res.status(409).json('El usuario ingresado ya existe');
    }

    const newUser = new User ({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET
        ).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }

});

// Login

router.post('/login', async (req,res) => {

        try {
            const user = await User.findOne({ username: req.body.username });

            if (!user) {
                return res.status(401).json('El usuario no está registrado');
            }

            if (req.body.password) {
                const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
                const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
                const inputPassword = req.body.password;

                if (originalPassword !== inputPassword) {
                    return res.status(401).json('La contraseña ingresada es incorrecta');
                }
            }

            const accessToken = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SECRET_KEY,
                // { expiresIn:'3d' }
            );

            const { password, ...others } = user._doc;
            res.status(200).json({ ...others, accessToken });
        } catch (err) {
            res.status(500).json(err);
        }
    }

);

module.exports = router;