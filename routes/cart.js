const express = require("express");
const Cart = require("../models/Cart");
const { verifyToken, verifyToken_auth, verifyToken_admin } = require("./verifyToken");

const router = express.Router();

// POST Create

router.post("/", verifyToken, async (req,res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }

})

// PUT Update

router.put("/:id", verifyToken_auth,  async (req,res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }

});

// DELETE Cart

router.delete("/:id", verifyToken_auth, async (req,res) => {

    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("El Carrito ha sido vaciado");
    } catch (err) {
        res.status(500).json(err)
    }

});

// GET User Cart

router.get("/find/:userId", verifyToken_auth, async (req,res) => {

    try {
        const cart = await Cart.findOne({ userId: req.params.id });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }

})

// GET All Items

router.get("/", verifyToken_admin, async (req,res) => {

    try {
        const carts = await Cart.find()
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }

 })

module.exports = router;