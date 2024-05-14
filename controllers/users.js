const db = require('../config/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils/index');
const notification = require('./notifications');

exports.login = async (req, res) => {
	try {

		let email = req.body.email; 
		let password = req.body.password;

		let user = await db.user.findOne({ where: { user_email: email } });

		if (!user) {
			return res.status(401).send({ success: 0, message: 'Falha na autenticação' });
		}
		if (bcrypt.compareSync(password, user.user_password)) {
			let token = jwt.sign(
				{
					id: user.uid,
				},
				'#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e',
				{
					algorithm: 'HS256',
					expiresIn: '1d',
				}
			);

			return res.status(200).send({
				success: 1,
				message: 'Autenticado com sucesso',
				token: token,
			});
		}

		return res.status(401).send({ success: 0, message: 'Falha na autenticação' });
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.register = async (req, res) => {
	try {

		let { email, password, name, status, type } = req.body;

		let existingUser = await db.user.findOne({ where: { user_email: email } });

		if (existingUser) {
			return res.status(409).send({ success: 0, message: 'Utilizador já registado' });
		}

		if (email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
		if (password.length < 12) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 12 ou mais caracteres' });

		let hashedPassword = await bcrypt.hash(password, 10);

		let newUser = await db.user.create({
			user_email: email,
			user_password: hashedPassword,
			user_name: name,
			user_statusus_id: status,
			user_typeutid: type
		});

		let response = {
			success: 1,
			message: 'Utilizador registado com sucesso',
		};

		return res.status(201).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.registerAdmin = async(req, res) =>{
	try {

		let idUserToken = req.user.id;
		let { email, password, name} = req.body;
		
		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let existingAdmin = await db.user.findOne({ where: { user_email: email } });

		if (existingAdmin) {
			return res.status(409).send({ success: 0, message: 'Admin já registado' });
		}

		if (email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
		if (password.length < 12) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 12 ou mais caracteres' });

		let hashedPassword = await bcrypt.hash(password, 10);

		let newAdmin = await db.user.create({
			user_email: email,
			user_password: hashedPassword,
			user_name: name,
			user_statusus_id: 1,
			user_typeutid: 1
		});

		let response = {
			success: 1,
			message: 'Admin registado com sucesso',
		};

		return res.status(201).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getUsers = async (req, res) => {
	try {

		let idUserToken = req.user.id;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });
		

		let users = await db.user.findAll();

		if (users.length === 0) return res.status(404).send({ success: 0, message: 'Não existem utilizadores' });

		let response = {
			success: 1,
			length: users.length,
			results: users.map((user) => {
				return {
					id: user.uid,
					email: user.user_email,
					name: user.user_name,
					status: user.user_statusus_id,
					type: user.user_typeutid
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getUser = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let user = await db.user.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		let response = {
			success: 1,
			length: 1,
			results: [{
				id: user.uid,
				email: user.user_email,
				name: user.user_name,
				status: user.user_statusus_id,
				type: user.user_typeutid
			}],
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


exports.editUser = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin && id != idUserToken) return res.status(403).send({ message: 'Sem permissão' });

		let user = await db.user.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		if (req.body.email) {
			if (req.body.email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
			user.email = req.body.email;
		}
		if (req.body.name) user.user_name = req.body.name;

		await user.save();

		let response = {
			success: 1,
			message: 'Utilizador editado com sucesso',
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeUser = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		if (idUserToken != id && !(await utils.isAdmin(idUserToken))) return res.status(401).send({ success: 0, message: 'Falha na autenticação' });

		let user = await User.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		await user.destroy();

		let response = {
			success: 1,
			message: 'Utilizador removido com sucesso',
		};

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

		let id = decode.uid;

		let user = await db.user.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		let response = {
			success: 1,
			user: {
				id: user.uid,
				email: user.user_email,
				name: user.user_name,
				status: user.user_statusus_id,
			},
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.changeUserType = async (req, res) => {
	try {
		let id = req.params.id;
		let type = req.body.type;
		let idUserToken = req.user.id;

		if (!(await utils.isAdmin(idUserToken)) && id != idUserToken) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		if (type != 'admin' && type != 'manager' && type != 'user') return res.status(406).send({ success: 0, message: 'Tipo de utilizador inválido (admin/manager/user)' });

		if (!(await utils.isAdmin(idUserToken)) && type === 'admin') return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let user = await User.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		user.type = type;
		if (type === 'user' || type === 'admin') {
			user.approved = -1;
		} else if (type === 'manager') {
			user.approved = 0;
		}
		await user.save();

		let response = {
			success: 1,
			message: 'Tipo de utilizador alterado com sucesso',
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.changePassword = async (req, res) => {
	try {
		let id = req.params.id;
		let oldPassword = req.body.oldPassword;
		let newPassword = req.body.newPassword;
		//let idUserToken = req.user.id;

		//if (id != idUserToken) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let user = await db.user.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });
		
		if (newPassword.length < 12) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 12 ou mais caracteres' });


		if (bcrypt.compareSync(oldPassword, user.user_password)) {

			let hash = await bcrypt.hashSync(newPassword, 10);

			user.user_password = hash;
			await user.save();


			let response = {
				success: 1,
				message: 'Palavra-passe alterada com sucesso',
			};


			return res.status(200).send(response);
		}

		return res.status(403).send({ message: 'Palavra-passe incorreta' });
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.suspendActivity = async (req, res) => {
	try{
		let id = req.params.id;
		let idUserToken = req.user.id;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ message: 'Sem permissão' });

		let user = await db.user.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		user.user_statusus_id = 2
		await user.save();

		let response = {
			success: 1,
			message: "Atividade suspensa com sucesso",
		};

		return res.status(200).send(response);
	}catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.informImproperConduct = async (req, res) =>{
	try{
		let id = req.params.id;
		let idUserToken = req.user.id;
		let description = req.body.description;
		let type = req.body.type;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ message: 'Sem permissão' });

		let user = await db.user.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		let newNotification = await notification.addNotifications(description, type, id);

		let response = {
			success: 1,
			message: "Notificação enviada com sucesso",
		};

		return res.status(200).send(response);
	}catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
}
