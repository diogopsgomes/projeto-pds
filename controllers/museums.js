const mysql = require("../config/mysql");
const utils = require("../utils/index");

exports.getMuseums = async (req, res) => {
	try {
		// Select all museums
		let query = "SELECT * FROM museums";
		let result = await mysql.execute(query, []);

		// If no museums
		if (result.length === 0) return res.status(404).send({ success: 0, message: "Não existem museus" });

		// Build response
		let response = {
			success: 1,
			length: result.length,
			results: result.map((museum) => {
				return {
					id: museum.id_museum,
					name: museum.name,
					type: museum.type,
					nif: museum.nif,
					address: museum.address,
					postalCode: museum.postal_code,
					city: museum.city,
					img: museum.img,
					bg: museum.bg,
					approved: museum.approved,
					idOwner: museum.id_user,
				};
			}),
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseum = async (req, res) => {
	try {
		// req.params
		let id = req.params.id;

		// Select specific museum
		let query = "SELECT * FROM museums WHERE id_museum = ?";
		let result = await mysql.execute(query, [id]);

		// If museum doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: "Museu inexistente" });

		// Build response
		let response = {
			success: 1,
			length: result.length,
			results: result.map((museum) => {
				return {
					id: museum.id_museum,
					name: museum.name,
					type: museum.type,
					nif: museum.nif,
					address: museum.address,
					postalCode: museum.postal_code,
					city: museum.city,
					img: museum.img,
					bg: museum.bg,
					approved: museum.approved,
					idOwner: museum.id_user,
				};
			}),
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addMuseum = async (req, res) => {
	try {
		// req.body
		let name = req.body.name;
		let type = req.body.type;
		let address = req.body.address;
		let postalCode = req.body.postalCode;
		let city = req.body.city;
		let nif = req.body.nif;
		let idOwner = req.body.idOwner;
		let idUserToken = req.user.id;

		// Check if user is admin & compare body user with token user
		if (!(await utils.isAdmin(idUserToken)) && idOwner != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });

		// Check if user exists
		let query = "SELECT * FROM users WHERE id_user = ?";
		let result = await mysql.execute(query, [idOwner]);

		// If user doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: "Utilizador inexistente" });

		// Insert museum in database
		query = "INSERT INTO museums (name, type, address, postal_code, city, nif, id_user) VALUES (?,?,?,?,?,?,?)";
		result = await mysql.execute(query, [name, type, address, postalCode, city, nif, idOwner]);

		// Build response
		let response = {
			success: 1,
			message: "Museu criado com sucesso",
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editMuseum = async (req, res) => {
	try {
		// req.params
		let id = req.params.id;
		let idUserToken = req.user.id;

		// Get museum data
		let query = "SELECT * FROM museums WHERE id_museum = ?";
		let result = await mysql.execute(query, [id]);

		// If museum doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: "Museu inexistente" });

		let idOwner = result[0].id_user;

		// Check if user is admin & compare db user with token user
		if (!(await utils.isAdmin(idUserToken)) && idOwner != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });

		// Museum data in database
		let address = result[0].address;
		let postalCode = result[0].postalCode;
		let city = result[0].city;
		let nif = result[0].nif;

		if (req.body.address) {
			address = req.body.address;
		}
		if (req.body.postalCode) {
			postalCode = req.body.postalCode;
		}
		if (req.body.city) {
			city = req.body.city;
		}
		if (req.body.nif) {
			if (!Number.isInteger(nif) && nif.length != 9) return res.status(406).send({ success: 0, message: "NIF inválido" });
			nif = req.body.nif;
		}

		// Update museum
		query = "UPDATE museums SET address = ?, postal_code = ?, city = ?, nif = ? WHERE id_user = ?";
		result = await mysql.execute(query, [address, postalCode, city, nif, id]);

		// Build response
		let response = {
			success: 1,
			message: "Utilizador editado com sucesso",
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeMuseum = async (req, res) => {
	try {
		// req.params
		let id = req.params.id;
		let idUserToken = req.user.id;

		// Get museum data
		let query = "SELECT * FROM museums WHERE id_museum = ?";
		let result = await mysql.execute(query, [id]);

		// If museum doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: "Museu inexistente" });

		let idOwner = result[0].id_user;

		// Check if user is admin & compare db user with token user
		if (!(await utils.isAdmin(idUserToken)) && idOwner != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });

		// Remove museum from database
		query = "DELETE FROM museums WHERE id_museum = ?";
		result = await mysql.execute(query, [id]);

		// Build response
		let response = {
			success: 1,
			message: "Museu removido com sucesso",
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.approveMuseum = async (req, res) => {
	try {
		// req.params
		let id = req.params.id;
		let idUserToken = req.user.id;

		// Check if user is admin
		if (!(await utils.isAdmin(idUserToken))) return res.status(403).send({ success: 0, message: "Sem permissão" });

		let query = "SELECT * FROM museums WHERE id_museum = ?";
		let result = await mysql.execute(query, [id]);

		// If user doesn't exist
		if (result.length === 0) return res.status(404).send({ success: 0, message: "Museu inexistente" });

		let approveStatus = result[0].approved;

		if (approveStatus === 1) return res.status(409).send({ success: 0, message: "Museu já aprovado" });

		let approved = 1;

		query = "UPDATE museums SET approved = ? WHERE id_museum = ?";
		result = await mysql.execute(query, [approved, id]);

		// Build response
		let response = {
			success: 1,
			message: "Museu aprovado com sucesso",
		};

		// Send response
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
