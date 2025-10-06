const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const auth = require('./auth');
const { upload, saveImageToDatabase, getUserImages } = require('./upload');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, '../public/dashboard.html'));
    } else {
        res.sendFile(path.join(__dirname, '../public/login.html'));
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await auth.register(username, password);
        req.session.userId = user.id;
        req.session.username = user.username;
        
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await auth.login(username, password);
        req.session.userId = user.id;
        req.session.username = user.username;
        
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Could not log out' });
        } else {
            res.json({ success: true, message: 'Logged out successfully' });
        }
    });
});

app.post('/api/upload', auth.requireAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageRecord = await saveImageToDatabase(
            req.session.userId,
            req.file.filename,
            req.file.originalname,
            req.file.path
        );

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            image: {
                id: imageRecord.id,
                filename: imageRecord.filename,
                originalName: imageRecord.originalName,
                url: `/uploads/${req.file.filename}`
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/images', auth.requireAuth, async (req, res) => {
    try {
        const images = await getUserImages(req.session.userId);
        const imagesWithUrls = images.map(image => ({
            ...image,
            url: `/uploads/${image.filename}`
        }));
        
        res.json({ images: imagesWithUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/user', (req, res) => {
    if (req.session.userId) {
        res.json({ 
            loggedIn: true, 
            username: req.session.username 
        });
    } else {
        res.json({ loggedIn: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});