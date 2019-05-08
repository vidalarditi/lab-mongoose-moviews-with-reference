const express = require('express');
const router  = express.Router();
const CelebrityModel = require("../../models/celebrity")
const MovieModel = require("../../models/movie")
const mongoose = require("mongoose")

/* GET home page */
router.get('/celebrities', (req, res, next) => {
  CelebrityModel.find({}, (err, result) => {
    if(err) console.log("Celebrity model error")
    res.render('celebrities/index', {title: "Celebrities", celebrities: result});
  })
});

router.get('/celebrities/:id', (req, res, next) => {
  CelebrityModel.findOne({_id : req.params.id})
    .populate("movies")
    .then((celebrity)=> {
      res.render('celebrities/show', {title: celebrity.name, celebrity: celebrity});
    })
    .catch((err)=> {
      if(err) console.log("Cannot find celebrity with:", req.params.id)
    })
});

router.get('/celebrity/new', (req, res, next) => {
  MovieModel.find({})
  .then((movies) => {
    res.render('celebrities/new', {title : "Add Celeb", movies : movies})
  })
})

router.post('/celebrity/new', (req, res, next) => {
  //Input Handling
  let name = req.body.name;
  let ocp = req.body.occupation
  let parsedMovieIds = req.body.movies
  if(parsedMovieIds.length > 0){
    console.log("Please add atleast 1 movie")
  } else if(parsedMovieIds.length == 1){
    parsedMovieIds = mongoose.Types.ObjectId(parsedMovieIds)
  } else {
    parsedMovieIds = req.body.movies.map((movieId)=> mongoose.Types.ObjectId(movieId))
  }
  CelebrityModel.create({name: name, occupation: ocp, movies: parsedMovieIds})
    .then(() => {
      res.redirect('/celebrities')
    })
    .catch((error) =>   {
      console.log("Cannot post new celebrity")
    })
  })

router.post('/celebrities/:id/delete', (req, res, next) => {
  CelebrityModel.findByIdAndDelete({_id : req.params.id})
  .then((celeb) => {
    res.redirect('/celebrities')
  })
})

module.exports = router;

