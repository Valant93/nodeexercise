const express = require('express');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();


app.use(bodyParser.json());
app.use(passport.initialize());


app.use('/users', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});