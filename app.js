const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

//Connect to mongoose
mongoose.connect('mongodb://ralleadmin:jumbotron1968@ds223015.mlab.com:23015/ralfdb', {
  useNewUrlParser: true
})
.then(() => {
  console.log('DB succesfully connected...')
})
.catch(err => console.log('Fehler: ', err));

// Load Idea Model
require('./models/Ideas');
const Idea = mongoose.model('ideas');


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middelware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome!';
  res.render('index', {
    title: title
  });
});


// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    });
  });
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  })
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({text:'Add a title!'});
  }
  if(!req.body.details){
    errors.push({text:'Add some details!'});
  }
  if(errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser)
    .save()
    .then (idea => {
      res.redirect('/ideas');
    });
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});