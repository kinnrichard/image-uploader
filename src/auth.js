const bcrypt = require('bcryptjs');
const db = require('./database');

const auth = {
    register: async (username, password) => {
        return new Promise((resolve, reject) => {
            console.log('Attempting to register user:', username);
            const hashedPassword = bcrypt.hashSync(password, 10);
            
            db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword],
                function(err) {
                    if (err) {
                        console.error('Registration error:', err.message);
                        if (err.message.includes('UNIQUE constraint failed')) {
                            reject(new Error('Username already exists'));
                        } else {
                            reject(err);
                        }
                    } else {
                        console.log('User registered successfully:', username, 'ID:', this.lastID);
                        resolve({ id: this.lastID, username });
                    }
                }
            );
        });
    },

    login: async (username, password) => {
        return new Promise((resolve, reject) => {
            console.log('Attempting to login user:', username);
            db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, user) => {
                    if (err) {
                        console.error('Login database error:', err.message);
                        reject(err);
                    } else if (!user) {
                        console.log('User not found:', username);
                        reject(new Error('Invalid username or password'));
                    } else {
                        console.log('User found, checking password for:', username);
                        const isValid = bcrypt.compareSync(password, user.password);
                        if (isValid) {
                            console.log('Login successful for:', username);
                            resolve({ id: user.id, username: user.username });
                        } else {
                            console.log('Invalid password for:', username);
                            reject(new Error('Invalid username or password'));
                        }
                    }
                }
            );
        });
    },

    requireAuth: (req, res, next) => {
        if (req.session && req.session.userId) {
            next();
        } else {
            res.status(401).json({ error: 'Authentication required' });
        }
    }
};

module.exports = auth;