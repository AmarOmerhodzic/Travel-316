import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TripManagement.css';

const TripManagement = () => {
    const initialTripState = {
        title: '',
        description: '',
        category: '',
        destinationImage: '',
        startDate: '',
        endDate: ''
    };
    const [trips, setTrips] = useState([]);
    const [newTrip, setNewTrip] = useState(initialTripState);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/trips');
            setTrips(response.data);
        } catch (error) {
            console.error('Error fetching trips', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTrip({ ...newTrip, [name]: value });
    };

    const addNewTrip = async () => {
        try {
            const token = await localStorage.getItem('userToken');
            await axios.post('http://localhost:3000/api/trips/add', newTrip, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewTrip(initialTripState);
            fetchTrips(); // Refresh the list
        } catch (error) {
            console.error('Error adding new trip', error);
        }
    };

    return (
        <div className="trip-management-container">
            <h2 className="trip-management-title">Trip Management</h2>

            <div className="trip-form-container">
                <h3>Add New Trip</h3>
                <form onSubmit={addNewTrip} className="trip-form">
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newTrip.title}
                            onChange={handleInputChange}
                            placeholder="Enter title"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="destinationImage">Destination Image URL:</label>
                        <input
                            type="text"
                            id="destinationImage"
                            name="destinationImage"
                            value={newTrip.destinationImage}
                            onChange={handleInputChange}
                            placeholder="Enter image URL"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newTrip.description}
                            onChange={handleInputChange}
                            placeholder="Enter description"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            name="category"
                            value={newTrip.category}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Category</option>
                            <option value="Africa">Africa</option>
                            <option value="Antarctica">Antarctica</option>
                            <option value="Asia">Asia</option>
                            <option value="Europe">Europe</option>
                            <option value="North America">North America</option>
                            <option value="Oceania">Oceania</option>
                            <option value="South America">South America</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={newTrip.startDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={newTrip.endDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" className="btn-add-trip">Add New Trip</button>
                </form>
            </div>

            <div className="trip-list-container">
                {trips.map((trip) => (
                    <div key={trip._id} className="trip-card">
                        <img src={trip.destinationImage} alt={trip.title} className="trip-image" />
                        <div className="trip-details">
                            <h3>{trip.title}</h3>
                            <p>{trip.description}</p>
                            <p>Category: {trip.category}</p>
                            <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
                            <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TripManagement;
