const passport = require('passport');
const Customer = require('./models/customer');
const { publishMessage } = require('./services/pubSubService');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    const user = await Customer.findOne({ email: profile.emails[0].value})
    if (!user) {
        let customer = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value, 
          img: profile.photos[0].value
        };
        await publishMessage('customer',JSON.stringify(customer))
        return done(null, customer);
    }
    user.numberOfVisits= user.numberOfVisits + 1
    await user.save();
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
