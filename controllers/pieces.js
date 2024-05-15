const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getPieces = async (req, res) => {
	try {
		let pieces = await db.piece.findAll();

		if (pieces.length === 0) return res.status(404).send({ success: 0, message: "Não existem peças" });

		let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
                    artist: piece.artistaid,
                    collection: piece.collectioncid,
                    category: piece.piece_categorypcid,
                    museum: piece.museummid,
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPieceById = async (req, res) => {
	try {
		let id = req.params.id;

		let piece = await db.piece.findByPk(id);

		if (!piece) {
			return res.status(404).send({ success: 0, message: "Peça inexistente" });
		}

		let response = {
			success: 1,
			length: 1,
			results: [{
				id: piece.pid,
					name: piece.piece_name,
                    artist: piece.artistaid,
                    collection: piece.collectioncid,
                    category: piece.piece_categorypcid,
                    museum: piece.museummid,
			}],
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching piece:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPiecesByName = async (req, res) => {
    try {
		let name = req.params.name;

		let pieces = await db.museum.findAll({ where: { piece_name: name } });

		if (!pieces || piece.length === 0) {
			return res.status(404).send({ success: 0, message: "Peça inexistente" });
		}

		let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
                    artist: piece.artistaid,
                    collection: piece.collectioncid,
                    category: piece.piece_categorypcid,
                    museum: piece.museummid,
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching pieces by name:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
}

exports.getPiecesByCategory = async (req, res) => {
    try {
        let categoryName = req.params.categoryName;

        let category = await db.piece_category.findAll({ where: { pc_description: categoryName } });

        if (!category) {
            return res.status(404).send({ success: 0, message: "Categoria inexistente" });
        }

        let pieces = await db.piece.findAll({ where: { piece_categorypcid: category.pcid } });

        if (!pieces) {
            return res.status(404).send({ success: 0, message: "Não há peças para esta categoria" });
        }

        let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
                    artist: piece.artistaid,
                    collection: piece.collectioncid,
                    category: piece.piece_categorypcid,
                    museum: piece.museummid,
				};
			}),
		};

        return res.status(200).send(response);
    } catch (err) {
        console.error("Error fetching pieces by category:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
}

exports.getPiecesByCollection = async (req, res) => {
    try {
        let collectionName = req.params.collectionName;

        let collection = await db.collection.findAll({ where: { collection_name: collectionName } });

        if (!collection) {
            return res.status(404).send({ success: 0, message: "Coleção inexistente" });
        }

        let pieces = await db.piece.findAll({ where: { collectioncid: collection.cid } });

        if (!pieces) {
            return res.status(404).send({ success: 0, message: "Não há peças para esta coleçãos" });
        }

        let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
                    artist: piece.artistaid,
                    collection: piece.collectioncid,
                    category: piece.piece_categorypcid,
                    museum: piece.museummid,
				};
			}),
		};

        return res.status(200).send(response);
    } catch (err) {
        console.error("Error fetching pieces by collection:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
}

exports.addPieces = async (req, res) => {
	try {

		let name = req.body.name;
        let artist = req.body.artist;
        let collection = req.body.collection;
        let category = req.body.category;
        let museum = req.body.museum;
		let idUserToken = req.user.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let newPiece = await db.piece.create({
			piece_name: name,
			artistaid: artist,
			collectioncid: collection,
			piece_categorypcid: category,
			museummid: museum
		});

		let response = {
			success: 1,
			message: "Piece criado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error adding piece:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removePiece = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let piece = await db.piece.findByPk(id);

		if (!piece) {
			return res.status(404).send({ success: 0, message: "Peça inexistente" });
		}

		let idOwner = piece.id_user;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		await piece.destroy();

		let response = {
			success: 1,
			message: "Peça removida com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error removing piece:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};
