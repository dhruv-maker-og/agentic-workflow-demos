const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/**
 * Get all users
 */
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsersFromDB();
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get user by ID
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await getUserByIdFromDB(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Placeholder DB functions
async function getUsersFromDB() {
  return [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];
}

async function getUserByIdFromDB(id) {
  const users = await getUsersFromDB();
  return users.find(user => user.id === id) || null;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
