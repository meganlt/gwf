const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

// If the request came from an authenticated user, this route
// sends back an object containing that user's information.
// Otherwise, it sends back an empty object to indicate there
// is not an active session.
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

// Handles the logic for creating a new user. The one extra wrinkle here is
// that we hash the password before inserting it into the database.
router.post('/register', (req, res, next) => {
  console.log('req.body:', req.body);
  const first_name = req.body.firstName;
  const last_name = req.body.lastName;
  const username = req.body.username;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);
  const age = req.body.age;
  const avatar = req.body.avatar;
  const gender = req.body.gender;
  const pronouns = req.body.pronouns;

  const sqlText = `
    INSERT INTO "user"
      ("first_name", "last_name", "username", "password", "pronouns", "gender_identity", "age", "avatar")
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8);
  `;
  const sqlValues = [first_name, last_name, username, hashedPassword, pronouns, gender, age, avatar];

  pool.query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201)
    })
    .catch((dbErr) => {
      console.log('POST /api/user/register error: ', dbErr);
      res.sendStatus(500);
    });
});

// Handles the logic for updating a user's profile information.
router.put('/update', async (req, res) => {
  console.log('in PUT /api/user/update with req.body:', req.body, req.user);

  const sqlText = `
    UPDATE "user"
    SET "first_name" = $1,
        "last_name" = $2,
        "pronouns" = $3,
        "gender_identity" = $4,
        "personality_on" = $5,
        "avatar" = $6,
        "username" = $7
    WHERE "id" = $8;
    `;
  const values = [ req.body.first_name, req.body.last_name, req.body.pronouns, req.body.gender_identity, req.body.dianaPersonalityOn, req.body.avatar, req.body.username, req.user.id ];

  pool.query(sqlText, values).then((results) => {
    res.sendStatus(201);
  }).catch((err) => {
    console.log('Error updating user profile:', err);
    res.sendStatus(500);
  })

});

// Handles the logic for logging in a user. When this route receives
// a request, it runs a middleware function that leverages the Passport
// library to instantiate a session if the request body's username and
// password are correct.
  // You can find this middleware function in /server/strategies/user.strategy.js.
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user:
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user.
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    res.sendStatus(200);
  });
});


module.exports = router;
