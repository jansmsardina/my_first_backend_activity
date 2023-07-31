const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const port = 5000; 

// Middleware to parse request bodies as JSON
app.use(cors());
app.use(bodyParser.json());

// Secret key for JWT
const jwtSecretKey = 'WD74PsecretKey';

// Books data
const Books = [
  {
    id: 1,
    BookName: "PHP 8",
    YearPublished: "2023",
    Author: "VicS",
    Category: "Web",
    status: 1,
},
{
    id: 2,
    BookName: "React.js",
    YearPublished: "2000",
    Author: "Peter SMith",
    Category: "Web",
    status: 1,
},
{
    id: 3,
    BookName: "CSS framework",
    YearPublished: "2005",
    Author: "Jaguar",
    Category: "Web",
    status: 1,
},
{
    id: 4,
    BookName: "Data Science",
    YearPublished: "2023",
    Author: "Vic S",
    Category: "Data",
    status: 1,
}
];

// Login Profiles
const LoginProfiles = [
  {
    id: 1,
    username: "admin",
    password: "passwd123",
    isAdmin: true,
},
{
    id: 2,
    username: "staff",
    password: "123456",
    isAdmin: false,
},
{
    id: 3,
    username: "vice",
    password: "abrakadabra",
    isAdmin: false,
},
{
    id: 4,
    username: "super",
    password: "69843",
    isAdmin: true,
},
{
    id: 5,
    username: "user",
    password: "123",
    isAdmin: false,
}
];

// Middleware for JWT verification
function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided.' });
  }

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Access Denied: Invalid token.' });
    }

    req.user = user;
    next();
  });
}

// Endpoint to return all books
app.get('/books', (req, res) => {
  res.json(Books);
});

// Endpoint to get book details by ID
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);

  const book = Books.find((book) => book.id === bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  res.json(book);
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const profile = LoginProfiles.find(
      (profile) => profile.username === username && profile.password === password
    );

    if (!profile) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate and return a JWT token
    const token = jwt.sign({ username, isAdmin: profile.isAdmin }, jwtSecretKey, { expiresIn: '1h' });
    res.json({ token });
  });

  // Protected endpoint with middleware security
  app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Access Granted!', user: req.user });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${5000}`);
  });