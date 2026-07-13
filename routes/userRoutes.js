const express = require('express');
const router = express.Router();

const { createUser, getUserById, userLogin } = require('../controllers/userController');
const {
    updatePreference,
    getPreference,
} = require("../controllers/preferenceController");

const authMiddleware = require("../middleware/authMiddleware");

router.get('/', (req, res) => {
    console.log("happy coding");
    res.json({ message: "hello. world" });
})

router.post('/signup', createUser);
router.post('/login', userLogin);

router.get('/preferences', authMiddleware, getPreference);
router.put('/preferences', authMiddleware, updatePreference);

router.get('/:id', getUserById);

module.exports = router;