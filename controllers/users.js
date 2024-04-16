const mysql = require('../config/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils/index');

exports.login = async (req, res) => {
	try {
		// req.body
		let email = req.body.email;
		let password = req.body.password;

		// Check if user exists
		let query = 'SELECT * FROM users WHERE email = ?';
		let result = await mysql.execute(query, [email]);

		// If user doesn't exist
		if (result.length === 0) return res.status(401).send({ success: 0, message: 'Falha na autenticação' });

		// If passwords match
		if (bcrypt.compareSync(password, result[0].password)) {
			// Generate token
			let token = jwt.sign(
				{
					id: result[0].id_user,
				},
				'#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e',
				{
					algorithm: 'HS256',
					expiresIn: '1d',
				}
			);

			// Send response
			return res.status(200).send({
				success: 1,
				message: 'Autenticado com sucesso',
				token: token,
			});
		}

		// If passwords don't match
		return res.status(401).send({ success: 0, message: 'Falha na autenticação' });
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.register = async (req, res) => {
	try {
		// req.body
		let email = req.body.email;
		let password = req.body.password;
		let name = req.body.name;
		let nif = req.body.nif;
		let address = req.body.address;
		let postalCode = req.body.postalCode;
		let city = req.body.city;

		// Check if user already exists in database
		let query = 'SELECT * FROM users WHERE email = ?';
		let result = await mysql.execute(query, [email]);

		// If user already exists
		if (result.length > 0) return res.status(409).send({ success: 0, message: 'Utilizador já registado' });

		// Verifications
		if (email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
		if (password.length < 8) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 8 ou mais caracteres' });
		if (!Number.isInteger(nif) && nif.length != 9) return res.status(406).send({ success: 0, message: 'NIF inválido' });

		// Password hash
		let hash = await bcrypt.hashSync(password, 10);

		// Insert user in database
		query = 'INSERT INTO users (email, password, name, nif, address, postal_code, city) VALUES (?,?,?,?,?,?,?)';
		result = await mysql.execute(query, [email, hash, name, nif, address, postalCode, city]);

		// Build response
		let response = {
			success: 1,
			message: 'Utilizador registado com sucesso',
		};

		// Send response
		return res.status(201).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getUsers = async (req, res) => {
	try {
		// req.params
		let idUserToken = req.user.id;

		// Check if user is admin
		if (!(await utils.isAdmin(idUserToken))) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		// Select all users
		let query = 'SELECT * FROM users';
		let result = await mysql.execute(query, []);

		// If no users
		if (result.length === 0) return res.status(404).send({ success: 0, message: 'Não existem utilizadores' });

		// Build response
		let response = {
			success: 1,
			length: result.length,
			results: result.map((user) => {
				return {
					id: user.id_user,
					email: user.email,
					name: user.name,
					nif: user.nif,
					address: user.address,
					postalCode: user.postal_code,
					city: user.city,
					type: user.type,
					approved: user.approved,
				};
			}),
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getUser = async (req, res) => {
	try {
		// req.params
		let id = req.params.id;
		let idUserToken = req.user.id;

		// Check if user is admin & compare params user with token user
		if (!(await utils.isAdmin(idUserToken)) && id != idUserToken) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		// Select specific user
		let query = 'SELECT * FROM users WHERE id_user = ?';
		let result = await mysql.execute(query, [id]);

		// If user doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		// Build response
		let response = {
			success: 1,
			length: result.length,
			results: result.map((user) => {
				return {
					id: user.id_user,
					email: user.email,
					name: user.name,
					nif: user.nif,
					address: user.address,
					postalCode: user.postal_code,
					city: user.city,
					type: user.type,
					approved: user.approved,
				};
			}),
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editUser = async (req, res) => {
	try {
		// req.params
		let id = req.params.id;
		let idUserToken = req.user.id;

		// Check if user is admin & compare params user with token user
		if (!(await utils.isAdmin(idUserToken)) && id != idUserToken) return res.status(403).send({ message: 'Sem permissão' });

		// Check if user exists
		let query = 'SELECT * FROM users WHERE id_user = ?';
		let result = await mysql.execute(query, [id]);

		// If user doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		// User data in database
		let email = result[0].email;
		let name = result[0].name;
		let nif = result[0].nif;
		let address = result[0].address;
		let postalCode = result[0].postal_code;
		let city = result[0].city;

		if (req.body.email) {
			if (req.body.email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
			email = req.body.email;
		}
		if (req.body.name) {
			name = req.body.name;
		}
		if (req.body.nif) {
			if (!Number.isInteger(nif) && nif.length != 9) return res.status(406).send({ success: 0, message: 'NIF inválido' });
			nif = req.body.nif;
		}
		if (req.body.address) {
			address = req.body.address;
		}
		if (req.body.postalCode) {
			postalCode = req.body.postalCode;
		}
		if (req.body.city) {
			city = req.body.city;
		}

		// Update user
		query = 'UPDATE users SET email = ?, name = ?, nif = ?, address = ?, postal_code = ?, city = ? WHERE id_user = ?';
		result = await mysql.execute(query, [email, name, nif, address, postalCode, city, id]);

		// Build response
		let response = {
			success: 1,
			message: 'Utilizador editado com sucesso',
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeUser = async (req, res) => {
	try {
		// req.params
		let id = req.params.id;
		let idUserToken = req.user.id;

		// Check if user is admin & compare params user with token user
		if (idUserToken != id && !(await utils.isAdmin(idUserToken))) return res.status(401).send({ success: 0, message: 'Falha na autenticação' });

		// Check if user exists
		let query = 'SELECT * FROM users WHERE id_user = ?';
		let result = await mysql.execute(query, [id]);

		// If user doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		// Remove user from database
		query = 'DELETE FROM users WHERE id_user = ?';
		result = await mysql.execute(query, [id]);

		// Build response
		let response = {
			success: 1,
			message: 'Utilizador removido com sucesso',
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.tokenVerify = async (req, res) => {
	try {
		let token = req.params.token;

		try {
			var decode = jwt.verify(token, '#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e');
		} catch (err) {
			return res.status(401).send({ success: 0, error: err, message: err.message });
		}

		let id = decode.id;

		// Select specific user
		let query = 'SELECT * FROM users WHERE id_user = ?';
		let result = await mysql.execute(query, [id]);

		// If user doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		// Build response
		let response = {
			success: 1,
			user: {
				id: result[0].id_user,
				email: result[0].email,
				name: result[0].name,
				type: result[0].type,
			},
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.changeUserType = async (req, res) => {
	try {
		// req.params & req.body
		let id = req.params.id;
		let type = req.body.type;
		let idUserToken = req.user.id;

		// Check if user is admin & compare params user with token user
		if (!(await utils.isAdmin(idUserToken)) && id != idUserToken) return res.status(403).send({ success: 0, message: 'Sem permissão' });
		// Verification of the input
		if (type != 'admin' && type != 'manager' && type != 'user') return res.status(406).send({ success: 0, message: 'Tipo de utilizador inválido (admin/manager/user)' });
		// Only admins can change the user type from other users to admin
		if (!(await utils.isAdmin(idUserToken)) && type === 'admin') return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let query = 'SELECT * FROM users WHERE id_user = ?';
		let result = await mysql.execute(query, [id]);

		// If user doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		let userType = result[0].type;

		if (userType === type) return res.status(406).send({ success: 0, message: 'Utilizador já é desse tipo' });

		if (type === 'user' || type === 'admin') {
			approved = -1;
		} else if (type === 'manager') {
			approved = 0;
		}

		query = 'UPDATE users SET type = ?, approved = ? WHERE id_user = ?';
		result = await mysql.execute(query, [type, approved, id]);

		// Build response
		let response = {
			success: 1,
			message: 'Tipo de utilizador alterado com sucesso',
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.changePassword = async (req, res) => {
	try {
		// req.params & req.body
		let id = req.params.id;
		let oldPassword = req.body.oldPassword;
		let newPassword = req.body.newPassword;
		let idUserToken = req.user.id;

		// Compare params user with token user
		if (id != idUserToken) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		// Check if user exists
		let query = 'SELECT * FROM users WHERE id_user = ?';
		let result = await mysql.execute(query, [id]);

		// If user doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });
		// Verifications
		if (newPassword.length < 8) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 8 ou mais caracteres' });

		// If passwords match
		if (bcrypt.compareSync(oldPassword, result[0].password)) {
			// Password hash
			let hash = await bcrypt.hashSync(newPassword, 10);

			// Update password
			query = 'UPDATE users SET password = ? WHERE id_user = ?';
			result = await mysql.execute(query, [hash, id]);

			// Build response
			let response = {
				success: 1,
				message: 'Palavra-passe alterada com sucesso',
			};

			// Send response
			return res.status(200).send(response);
		}

		// If passwords don't match
		return res.status(403).send({ message: 'Palavra-passe incorreta' });
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
