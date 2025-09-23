const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let cards = [];
let nextId = 1;

app.get('/cards', (req, res) => {
  res.json(cards);
});

app.get('/cards/:id', (req, res) => {
  const card = cards.find(c => c.id === parseInt(req.params.id));
  if (card) res.json(card);
  else res.status(404).json({ message: 'Card not found' });
});

app.post('/cards', (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ message: 'Suit and value are required' });
  }
  const card = { id: nextId++, suit, value };
  cards.push(card);
  res.status(201).json(card);
});

app.delete('/cards/:id', (req, res) => {
  const index = cards.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    const deleted = cards.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

app.listen(port, () => {
  console.log(`Playing Card API running at http://localhost:${port}`);
});
