
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js'),
    coordinates = require('./coordinates.server.controller.js');
    
/*REFLECTION: 
Throughout the bootcamp, I encountered many problems. These were mostly standard programming problems a
programmer would encounter in encountering bugs, syntax errors, or not fully understanding how a function/
part of the language works. Most of these I solved by asking for help from my peers, looking them up online or at the
mongoose website, or one of the tutorials that was linked in the code. I also found creating the graph to be fairly challenging, 
since it involved specifically mapping out technological things that I wasn't too well versed in. Overall I got more experience on 
using middleware, more node.js/mongoose, express and other things we've been introduced to in the class. 
 
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }
 
  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
      console.log(listing)
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing - note the order in which this function is called by the router*/
exports.update = function(req, res) {
  var listing = req.listing;
  let updatedlisting = req.body;

  if(req.results) {
    updatedlisting.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }
  /* Replace the listings's properties with the new properties found in req.body */
  Listing.findOneAndUpdate({_id: listing._id}, updatedlisting, function (err, update) {
    if (err){
      res.status(404).send(err);
    }
    else{
      Listing.findByID(listing._id, function(error, toupdate){
        if (error){
        res.status(404).send(error);
        }
      else {
        res.status(200).send(updatedlisting);
      }
    }
      )
  }
  }   
  )

  /* Save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
      console.log(listing)
    }
  });

};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;
  Listing.findOne({code: listing.code}, function (err, deletedlisting){ 
    if (err){
      res.status(400).send(err);
    }
  else{
  deletedlisting.remove({_id: req.params.listing_id}, function(err, listing){
    if (err){
      console.log(err);
      res.status(400).send(err);
    }
    else {
      res.status(200).send(deletedlisting);
    }
  })
}})
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  Listing.find()
  .then(listings => {res.send(listings);
  }).catch(err => {
    res.status(500).send(
      {message: err.message || "Not found"}
    )
  })
  /*Listing.get(function(err, contacts){
    if (err){
      res.status(404).send(err);
    }
    res.json({
      data: contacts
    });
  })*/
};
/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};
 /* Listing.findById(req.params.id, function (err, updatedlisting) {
  if (err){
      res.status(404).send(err);
    }
    else{
    updatedlisting.code = req.body.code;
    updatedlisting.name = req.body.name;
    if (req.body.address){
    updatedlisting.address = req.body.address;
    }
    if (req.body.coordinates){
    updatedlisting.coordinates = req.body.coordinates;
    }}*/