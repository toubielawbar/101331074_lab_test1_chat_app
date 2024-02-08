const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT  = process.env.PORT || 3500;





const chatRoute = require('./routes/ChatRoute')

app.use(express.json());

app.use(chatRoute)



  

const uri = 'mongodb+srv://f2023_comp3123:fullstack_assignment1@cluster0.w2zjbvo.mongodb.net/labtest1?retryWrites=true&w=majority';

mongoose.connect(uri, {
   
  
  }).then(success => {
    console.log('Success Mongodb connection')
  }).catch(err => {
    console.log('Error Mongodb connection')
  });

  // SOCKET IO CONNECTION
  

app.listen(PORT, () => {
    console.log( `Listening on ${PORT}` );
})