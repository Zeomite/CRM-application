require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const connectRabbitMQ = require('./config/rabbitmq');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('passport');
const session = require('express-session');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
require('./passportConfig');
const path = require('path'); 
const cors = require('cors')


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5000', 
    credentials: true, 
  }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


const dirname = String(__dirname).replace("backend","")
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static(path.join(dirname, 'frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(dirname, 'frontend/build', 'index.html'));
  });
  


// Connect to DB and RabbitMQ 
connectDB();
const rabbitMQConnection = connectRabbitMQ();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

