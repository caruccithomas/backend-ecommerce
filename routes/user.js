const express = require("express");
const User = require("../models/User");
const { verifyToken_auth, verifyToken_admin } = require("./verifyToken");

const router = express.Router();

// GET/POST Tests

// router.get("/usertest", (req,res) => {
//     res.send("User Test Successfull");
// });

// router.post("/userposttest", (req, res) => {
//     const username = req.body.username;
//     res.send(`¡Welcome back, ${username}!`);
// })

// PUT User Update

router.put("/:id", verifyToken_auth,  async (req,res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err)
    }

});

// DELETE User

router.delete("/:id", verifyToken_auth, async (req,res) => {

    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("El Usuario ha sido eliminado")
    } catch (err) {
        res.status(500).json(err)
    }

})

// GET User

router.get("/find/:id", verifyToken_admin, async (req,res) => {

    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }

})

// GET All Users

router.get("/", verifyToken_admin, async (req,res) => {
    const query = req.query.new;

    try {
        const users = query 
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }

 })

// GET User Stats

router.get("/stats", verifyToken_admin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try {
        const data = await User.aggregate([
            {
                $match: {createdAt: { $gte: lastYear }}
            },
            {
                $project: {month: { $month: "$createdAt" }}
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }

})

module.exports = router;

