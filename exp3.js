const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let seats = {}; // { seatId: { status: 'available'|'locked'|'booked', lockedBy: userId, lockTimer: Timeout } }
const seatCount = 10;
const LOCK_DURATION = 60000; // 1 minute

for (let i = 1; i <= seatCount; i++) {
  seats[i] = { status: 'available', lockedBy: null, lockTimer: null };
}

app.get('/seats', (req, res) => {
  res.json(seats);
});

app.post('/lock', (req, res) => {
  const { seatId, userId } = req.body;
  const seat = seats[seatId];
  if (!seat) return res.status(404).json({ message: 'Seat not found' });

  if (seat.status === 'available') {
    seat.status = 'locked';
    seat.lockedBy = userId;
    seat.lockTimer = setTimeout(() => {
      seat.status = 'available';
      seat.lockedBy = null;
      seat.lockTimer = null;
      console.log(`Lock expired for seat ${seatId}`);
    }, LOCK_DURATION);
    return res.json({ message: `Seat ${seatId} locked for user ${userId}` });
  } else if (seat.status === 'locked') {
    return res.status(400).json({ message: `Seat ${seatId} is already locked by user ${seat.lockedBy}` });
  } else {
    return res.status(400).json({ message: `Seat ${seatId} is already booked` });
  }
});

app.post('/confirm', (req, res) => {
  const { seatId, userId } = req.body;
  const seat = seats[seatId];
  if (!seat) return res.status(404).json({ message: 'Seat not found' });

  if (seat.status === 'locked' && seat.lockedBy === userId) {
    clearTimeout(seat.lockTimer);
    seat.status = 'booked';
    seat.lockedBy = null;
    seat.lockTimer = null;
    return res.json({ message: `Seat ${seatId} successfully booked by user ${userId}` });
  } else if (seat.status === 'locked') {
    return res.status(400).json({ message: `Seat ${seatId} is locked by another user` });
  } else if (seat.status === 'booked') {
    return res.status(400).json({ message: `Seat ${seatId} is already booked` });
  } else {
    return res.status(400).json({ message: `Seat ${seatId} is not locked` });
  }
});

app.listen(port, () => {
  console.log(`Ticket Booking API running at http://localhost:${port}`);
});
