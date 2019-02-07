const express = require('express');
const exphbs  = require('express-handlebars');
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

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});