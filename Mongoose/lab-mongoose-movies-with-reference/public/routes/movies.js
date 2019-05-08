const express = require('express');
const router  = express.Router();
const CelebrityModel = require("../../models/celebrity")
const MovieModel = require("../../models/movie")
const mongoose = require("mongoose")

router.get('/movies', (req, res, next) => {
  MovieModel.find({})
  .then((movies) => {
    res.render('movies/index', {movies : movies})
  })
  .catch((err) => {
    if(err) console.log("Error with movies index")
  })
});

router.get('/movies/:id', (req, res, next) => {
  MovieModel.findOne({_id : req.params.id})
    .then((movie)=> {
      res.render('movies/show', {title: movie.title, movie: movie});
    })
    .catch((err)=> {
      if(err) console.log("Cannot find movie with:", req.params.id)
    })
});

router.get('/movie/new', (req, res, next) => {
  CelebrityModel.find({})
  .then((celebrities) => {
    res.render('movies/new', {title : "Add Movie", celebrities : celebrities})
  }).catch((err) => {
    if(err) console.log("cant get add movie")
  })
});

router.post('/movie/new', (req, res, next) => {
  let title = req.body.title;
  let genre = req.body.genre
  let description = req.body.description
  let stars = req.body.stars
  if(!Array.isArray(req.body.stars)) {
    if(stars){
      stars = [mongoose.Types.ObjectId(stars)]
    } else {
      console.log("Please add at least 1 celebrity")
    }
  } else {
    stars = stars.map((celebId) => mongoose.Types.ObjectId(celebId))
  }
  CelebrityModel.find({_id : {$in : stars}})
  .then((stars) => {
    let starNames = stars.map((celeb) => celeb.name)
    MovieModel.create({title : title, genre : genre, description : description, stars : starNames})
  })
  .then(() => {
    res.redirect('/movies')
  })
  .catch((err) => {
    if(err )console.log("Cannot post new movie")
  })
})

router.post('/movies/:id/delete', (req, res, next) => {
  MovieModel.findByIdAndDelete({_id : mongoose.Types.ObjectId(req.params.id)})
  .then(() => {
    res.redirect('/movies')
  })
})

module.exports = router;