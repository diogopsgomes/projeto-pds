const User = require('../models/user');
const utils = require('../utils/index');

exports.login = async (req, res) => {
	try {

		let email = req.body.email; 
		let password = req.body.password;

		let user = await User.findOne({ where: { email: email } });

		if (!user) {
			return res.status(401).send({ success: 0, message: 'Falha na autenticação' });
		}

		let passwordMatch = await user.comparePassword(password);

		if (passwordMatch) {

            let token = user.generateAuthToken();
            
			return res.status(200).send({
				success: 1,
				message: 'Autenticado com sucesso',
				token: token,
			});
		}

		return res.status(401).send({ success: 0, message: 'Falha na autenticação' });
	} catch (err) {
		console.error("Error authenticating user:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.register = async (req, res) => {
	try {

		let { email, password, name, nif, address, postalCode, city } = req.body;

		let existingUser = await User.findOne({ where: { email: email } });
		if (existingUser) {
			return res.status(409).send({ success: 0, message: 'Utilizador já registado' });
		}

		if (email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
		if (password.length < 8) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 8 ou mais caracteres' });
		if (!Number.isInteger(nif) && nif.length !== 9) return res.status(406).send({ success: 0, message: 'NIF inválido' });

		let hashedPassword = await bcrypt.hash(password, 10);

		let newUser = await User.create({
			email: email,
			password: hashedPassword,
			name: name,
			nif: nif,
			address: address,
			postal_code: postalCode,
			city: city
		});

		let response = {
			success: 1,
			message: 'Utilizador registado com sucesso',
            id: newUser.id_user
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

		let users = await User.findAll();

		if (users.length === 0) return res.status(404).send({ success: 0, message: 'Não existem utilizadores' });

		let response = {
			success: 1,
			length: users.length,
			results: users.map((user) => {
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
		if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let user = await User.findByPk(id);


		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		let response = {
			success: 1,
			length: 1,
			results: [{
				id: user.id_user,
				email: user.email,
				name: user.name,
				nif: user.nif,
				address: user.address,
				postalCode: user.postal_code,
				city: user.city,
				type: user.type,
				approved: user.approved,
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

		let user = await User.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		if (req.body.email) {
			if (req.body.email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
			user.email = req.body.email;
		}
		if (req.body.name) user.name = req.body.name;
		if (req.body.nif) {
			if (!Number.isInteger(user.nif) && user.nif.length != 9) return res.status(406).send({ success: 0, message: 'NIF inválido' });
			user.nif = req.body.nif;
		}
		if (req.body.address) user.address = req.body.address;
		if (req.body.postalCode) user.postal_code = req.body.postalCode;
		if (req.body.city) user.city = req.body.city;

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

		let id = decode.id;

		let user = await User.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		let response = {
			success: 1,
			user: {
				id: user.id_user,
				email: user.email,
				name: user.name,
				type: user.type,
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
		let idUserToken = req.user.id;

		if (id != idUserToken) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let user = await User.findByPk(id);
		if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

		if (newPassword.length < 8) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 8 ou mais caracteres' });


		if (bcrypt.compareSync(oldPassword, user.password)) {

			let hash = await bcrypt.hashSync(newPassword, 10);


			user.password = hash;
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
