require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes'); 


app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use('/events', eventRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
