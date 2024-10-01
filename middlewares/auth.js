// const jwt = require("jsonwebtoken");
const passport = require("passport");
const Users = require("../models/users");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await Users.getUserById(payload.id);
        if (user.length === 0) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);



// const authenticate = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// const checkRoles = (roles) => {
//     return async (req, res, next) => {
//         const user = req.user;

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         if (roles.includes(user.role)) {
//             next();
//         }
//         return res.status(403).json({ message: 'Access forbidden: Role not allowed' });
//     };
// };

module.exports = passport;

// module.exports = {
//   checkRoles,
//   authenticate,
// };
