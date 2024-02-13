const Trip = require('../models/Trip');


exports.addTrip = async (req, res) => {
    try {
      const { title, destinationImage, description, category, startDate, endDate } = req.body;
      let trip = new Trip({ title, destinationImage, description, category, startDate, endDate });
      await trip.save();
      res.status(201).json(trip);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  exports.getAllTrips = async (req, res) => {
    try {
      const trips = await Trip.find({}).populate({
        path: 'comments',
        select: 'text user',
        populate: { path: 'user', select: 'username' }
      });
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  exports.getTripById = async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id).populate({
        path: 'comments',
        select: 'text user',
        populate: { path: 'user', select: 'username' }
      });
  
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
  
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  


