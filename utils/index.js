const mysql = require('../config/mysql');

exports.isAdmin = async (id) => {
	let query = 'SELECT type FROM users WHERE id_user = ?';
	let result = await mysql.execute(query, [id]);

	if (result[0].type != 'admin') return 0;

	return 1;
};

exports.isManager = async (id) => {
	let query = 'SELECT type FROM users WHERE id_user = ?';
	let result = await mysql.execute(query, [id]);

	if (result[0].type != 'manager') return 0;

	return 1;
};
