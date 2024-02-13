const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../authMiddleware');

router.post('/add', auth.authenticate, auth.isAdmin, tripController.addTrip);
router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);



module.exports = router;