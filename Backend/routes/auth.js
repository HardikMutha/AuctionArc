const express = require("express")
const router = express.Router();
const {createUser, loginUser} = require("../controllers/auth")

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/logout", (req, res) => {

    res.clearCookie("token")
    res.json({ message: "Logged Out" })
});

module.exports = router;


