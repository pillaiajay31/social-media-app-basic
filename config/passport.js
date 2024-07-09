const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (jwt_payload, done) => {
            try
            {
                const user = await User.findById(jwt_payload.id);
                if (user) 
                {
                    return done(null, user);
                }
                return done(null, false);
            } 
            catch (err) 
            {
                console.error('Error finding user with JWT payload:', err.message);
                return done(err, false);
            }
        })
    );
};
