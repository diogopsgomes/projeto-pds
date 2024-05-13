const db = require('../config/mysql');
const utils = require('../utils/index');

exports.getMuseums = async (req, res) => {
	try {
		let museums = await db.museum.findAll();

		if (museums.length === 0) return res.status(404).send({ success: 0, message: "Não existem museus" });

		let response = {
			success: 1,
			length: museums.length,
			results: museums.map((museum) => {
				return {
					id: museum.mid,
					name: museum.museum_name,
                    address: museum.museum_address,
                    category: museum.museum_categorymcid,
					zip: museum.zip_codezipid,
					zip_ext: museum.zip_ext,
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseumById = async (req, res) => {
	try {
		let id = req.params.id;

		let museum = await db.museum.findByPk(id);

		if (!museum) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		let response = {
			success: 1,
			length: 1,
			results: [{
				id: museum.mid,
				name: museum.museum_name,
                address: museum.museum_address,
                category: museum.museum_categorymcid,
				zip: museum.zip_codezipid,
				zip_ext: museum.zip_ext,
			}],
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseumsByName = async (req, res) => {
    try {
		let name = req.params.name;

		let museums = await db.museum.findAll({ where: { museum_name: name } });

		if (!museums) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		let response = {
			success: 1,
			length: museums.length,
			results: museums.map((museum) => {
				return {
					id: museum.mid,
					name: museum.museum_name,
                    address: museum.museum_address,
                    category: museum.museum_categorymcid,
					zip: museum.zip_codezipid,
					zip_ext: museum.zip_ext,
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseumsByCategory = async (req, res) => {
    try {
        let categoryName = req.params.categoryName;

        let category = await db.museum_category.findOne({ where: { mc_description : categoryName } });

        if (!category) {
            return res.status(404).send({ success: 0, message: "Categoria inexistente" });
        }

        let museums = await db.museum.findAll({ where: { museum_categorymcid: category.mcid } });

        if (!museums) {
            return res.status(404).send({ success: 0, message: "Não há museus para esta categoria" });
        }

        let response = {
			success: 1,
			length: museums.length,
			results: museums.map((museum) => {
				return {
					id: museum.mid,
					name: museum.museum_name,
                    address: museum.museum_address,
                    category: museum.museum_categorymcid,
					zip: museum.zip_codezipid,
					zip_ext: museum.zip_ext,
				};
			}),
		};

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.addMuseum = async (req, res) => {
	try {

		let name = req.body.name;
		let address = req.body.address;
		let premium = req.body.premium;
		let zip_ext = req.body.zip_ext;
		let category = req.body.category;
		let zip_code = req.body.zip_code;
		//let idOwner = req.body.idOwner;
		//let idUserToken = req.user.id;

		/*let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}
		*/

		/*let user = await db.user.findByPk(idOwner);
		if (!user) {
			return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
		}
		*/

		let newMuseum = await db.museum.create({
			museum_name: name,
			museum_address: address,
			premium: premium,
			zip_ext: zip_ext,
			museum_categorymcid: category,
			zip_codezipid: zip_code,
		});

		let response = {
			success: 1,
			message: "Museu criado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editMuseum = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let museum = await db.museum.findByPk(id);

		if (!museum) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		let isAdmin = await utils.isAdmin(idUserToken);
		let isManager = await utils.isManager(idUserToken);
		if (!isAdmin || !isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let { name, address, category, zip_code } = req.body;

		museum.museum_name = name;
		museum.museum_address = address;
		museum.museum_categorymcid = category;
		museum.zip_codezipid = zip_code;

		await museum.save();

		let response = {
			success: 1,
			message: "Museu editado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeMuseum = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let museum = await db.museum.findByPk(id);

		if (!museum) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		let isAdmin = await utils.isAdmin(idUserToken);
		let isManager = await utils.isManager(idUserToken);
		if (!isAdmin || !isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		await museum.destroy();

		let response = {
			success: 1,
			message: "Museu removido com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.approveMuseum = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let museum = await db.museum.findByPk(id);

		if (!museum) {
			return res.status(404).send({ success: 0, message: "Museu inexistente" });
		}

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		if (museum.approved === 1) {
			return res.status(409).send({ success: 0, message: "Museu já aprovado" });
		}

		museum.approved = 1;
		await museum.save();

		let response = {
			success: 1,
			message: "Museu aprovado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


