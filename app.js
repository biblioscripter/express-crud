const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Load users data asynchronously
let users;
fs.readFile('./data.json', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    try {
        users = JSON.parse(data);
        if (!Array.isArray(users)) {
            console.error("Error: Users data is not an array.");
            users = [];
        }
    } catch (parseError) {
        console.error("Error parsing users data:", parseError);
        users = [];
    }
});

// Route to get users
app.get('/api/users', (req, res) => {
    if (users) {
        res.send(users);
    }
    else {
        console.error("User list is empty!")
    }
})

// Route to add a new user
app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({ id: users.length + 1, ...body });
    fs.writeFile('./data.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
        return res.json({ status: 'success', id: users.length });
    });
});

// Route to update a user
app.patch('', () => {
    
})

// Route to delete a user
app.delete('/api/users/:id', (req, res) => {
    const userIdToDelete = Number(req.params.id);
    const indexToDelete = users.findIndex(user => user.id === userIdToDelete);
    console.log(indexToDelete)
    if (indexToDelete === -1) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    users.splice(indexToDelete, 1);

    fs.writeFile('./data.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
        return res.json({ status: 'success', message: 'User deleted successfully' });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
