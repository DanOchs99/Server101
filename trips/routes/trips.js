const Trip = require('../trip');

const express = require('express');
const router = express.Router();

const uuidv4 = require('uuid/v4');

// route handlers for /trips
router.get('/',(req,res) => {
    // show all the trips for the current user
    my_trips = trips.filter(function (trip) {
       return (trip.username == req.session.username);
    });
    res.render('trips',{cities: cities, user: req.session.username, trips: my_trips});
});

router.post('/',(req,res) => {
    // add a new trip
    trip = new Trip(req.session.username, req.body.dest, req.body.dep, req.body.ret);
    trips.push(trip);
    res.redirect('/');
});

router.post('/remove',(req,res) => {
    // remove a trip with a given timestamp
    trips = trips.filter(function (trip) {
        return (trip.tripId != req.body.delTrip);
    });
    res.redirect('/');
});

module.exports = router;