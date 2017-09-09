var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/user');

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
module.exports = function(passport) {

passport.use(new GoogleStrategy({
    clientID: 'your google client id',
    clientSecret: 'your google client secret',
    callbackURL: 'http://localhost:3000/login/google/callback',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {

          User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                  return done(err);
                if (user) {
                  return done(null, user);
                } else {
                  var newUser = new User();

                  newUser.google.id    = profile.id;
                  newUser.google.access_token = accessToken;
                  newUser.google.firstName  = profile.name.givenName;
                  newUser.google.lastName = profile.name.familyName;
                  newUser.google.email = profile.emails[0].value;
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                          return done(null, newUser);
                  });
              }
          });
        });
      }));
};
