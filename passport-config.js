const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

function passportInitialize(passport, getUserByEmail, getUserByID){  
    const authentication = async (email, password, done)=>{
        const user = getUserByEmail(email);
        if(user == null){
            return done(null, false, {message:"No user with that email"});
        }
        
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            }
            else{
                return done(null, false, {message:"Invalid password"});
            }
        } catch (error) {
            return done(error);
        }
    }
    passport.use(new localStrategy({usernameField: "email"}, authentication));
    passport.serializeUser((user, done)=> done(null, user.id));
    passport.deserializeUser((id, done)=>{
        return done(null, getUserByID(id));
    });
}

module.exports = passportInitialize;