const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const qs = require('querystring');

const app = express();

// Replace these with your actual Google OAuth credentials
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
const JWT_SECRET = 'your_jwt_secret'; // For signing JWTs

const redirectUri = 'http://localhost:3000/auth/google/callback';

// Middleware for sessions
app.use(session({
  secret: 'your_secret_key',  // Keep this secure
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }   // Session expires in 1 minute
}));

// Home Route
app.get('/', (req, res) => {
  res.send(`
    <h1>Google OAuth with JWT</h1>
    <a href="/auth/google">Login with Google</a>
  `);
});

// Route to start Google OAuth
app.get('/auth/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${qs.stringify({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline'
  })}`;
  res.redirect(googleAuthUrl);
});

// Google OAuth callback route
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange authorization code for tokens
    const response = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }));

    const { id_token, access_token } = response.data;

    // Fetch user's profile information
    const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
      headers: { Authorization: `Bearer ${id_token}` }
    });

    const user = userInfoResponse.data;

    // Create JWT with user data
    const token = jwt.sign(
      {
        sub: user.id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    // Send token as response
    res.send(`
      <h1>Welcome, ${user.name}</h1>
      <p>Email: ${user.email}</p>
      <p>Your JWT: <strong>${token}</strong></p>
    `);

  } catch (error) {
    res.status(500).send('Authentication failed.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
