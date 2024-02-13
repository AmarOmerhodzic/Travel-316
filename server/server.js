const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const commentRoutes = require('./routes/commentRoutes');
const User = require('./models/User');
const crypto = require('crypto');
const cors = require('cors'); // Import the cors middleware

mongoose.connect('mongodb+srv://omerhodzicamar21:LsH8nIkMuwtX352Q@cluster0.6fb2mzp.mongodb.net/?retryWrites=true&w=majority', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => {
   console.log("MongoDB Connected");
   ensureAdminUser();
  })
  .catch(err => console.log(err));
async function ensureAdminUser() {
  try {
    const adminUser = await User.findOne({ email: "admin@example.com" });
    if (!adminUser) {
      const newAdmin = new User({
        username: "admin",
        password: "adminpass",
        email: "admin@example.com",
        role: "admin",
        isActive: true
      });
      await newAdmin.save();
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error ensuring admin user:", error);
  }
}

const app = express();

app.use(express.json());
app.use(cors()); // Use cors middleware here
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('Tour the world');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}
