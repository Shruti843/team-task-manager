require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const user = await User.create({ name: 'Test', email: 'test'+Date.now()+'@example.com', password: 'password', role: 'Member' });
    console.log("Success:", user);
  } catch (err) {
    console.error("Error:", err);
  }
  process.exit(0);
}
test();
