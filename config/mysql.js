const mysql = require('mysql');

let pool = mysql.createPool({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '',
	database: 'musewww',
});

exports.execute = (query, params = []) => {
	return new Promise((resolve, reject) => {
		pool.query(query, params, (error, result, fields) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

exports.pool = pool;
