const db = require('../config/db');

exports.findByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

exports.createUser = (username, email, password, role_id, callback) => {
  const query = `INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)`;
  db.query(query, [username, email, password, role_id], callback);
};
