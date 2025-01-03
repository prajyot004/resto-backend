

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;
app.use(bodyParser.json());
app.use(cors());

let bookings = []; // Temporary data storage

app.get('/api/availability', (req, res) => {
  console.log("Query Params of get Availability:", req.query);
  const { date, time } = req.query;

  if (!date || !time) {
    return res.status(400).json({ error: "Date and time are required." });
  }

  //  to Show availability
  const isAvailable = !bookings.find(
    (booking) => booking.date === date && booking.time === time
  );

  res.json(isAvailable ? [`${time} slot is available`] : [`${time} slot is unavailable`]);
});



{/**Book the Slot  */}
app.post('/api/bookings', (req, res) => {
  const { date, time, guests, name, contact } = req.body;

  if (!date || !time || !guests || !name || !contact) {
    console.error('Validation failed. Missing fields.');
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (bookings.find((booking) => booking.date === date && booking.time === time)) {
    return res.status(400).json({ error: 'Slot already booked' });
  }

  const newBooking = { date, time, guests, name, contact };
  bookings.push(newBooking);
  res.status(201).json({newBooking});
});

{/**Delete Booking */}
app.delete('/api/bookings', (req, res) => {
  const { date, time } = req.body;
  bookings = bookings.filter(
    (booking) => booking.date !== date || booking.time !== time
  );
  res.status(200).json({ message: 'Booking deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
