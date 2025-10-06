const bcrypt = require('bcryptjs');
const db = require('./database');

const auth = {
    register: async (username, password) => {
        return new Promise((resolve, reject) => {
            const hashedPassword = bcrypt.hashSync(password, 10);
            
            db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword],
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            reject(new Error('Username already exists'));
                        } else {
                            reject(err);
                        }
                    } else {
                        resolve({ id: this.lastID, username });
                    }
                }
            );
        });
    },

    login: async (username, password) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, user) => {
                    if (err) {
                        reject(err);
                    } else if (!user) {
                        reject(new Error('Invalid username or password'));
                    } else {
                        const isValid = bcrypt.compareSync(password, user.password);
                        if (isValid) {
                            resolve({ id: user.id, username: user.username });
                        } else {
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