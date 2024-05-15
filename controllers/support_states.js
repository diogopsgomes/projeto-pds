const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAllSupportStates = async (req, res) =>{
    try{
        let idUserToken = req.user.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let states = await db.support_state.findAll();

        if (states.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem estados de suporte" });

        let response = {
			success: 1,
			length: states.length,
			results: states.map((support_state) => {
				return {
                    id: support_state.ssid,
                    description: support_state.description,
				};
			}),
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getSupportState = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let id = req.params.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let state = await db.support_state.findByPk(id);

        if (!state)
			return res.status(404).send({ success: 0, message: "Estado inexistente" });

        let response = {
            success: 1,
            length: 1,
            results: [
                {
                    id: support_state.ssid,
                    description: support_state.description,
                },
            ],
        };

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addSupportState = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let ss_description = req.body.description;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let new_Support_state = await db.support_state.create({
            description: ss_description,
		});
	
		let response = {
			success: 1,
			message: "Estado de suporte adicionado com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeSupportState = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let id = req.params.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let state = await db.support_state.findByPk(id);

        if (!state) {
			return res.status(404).send({ success: 0, message: "Estado inexistente" });
		}

        await state.destroy();

		let response = {
			success: 1,
			message: "Estado removido com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editSupportEvaluation = async (req, res) =>{
    try{
        let id = req.params.id;
		let idUserToken = req.user.id;
        let description = req.body.description;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let state = await db.support_state.findByPk(id);
        if (!state) {
			return res.status(404).send({ success: 0, message: "Estado inexistente" });
		}

        state.description = description;

        await state.save();

		let response = {
			success: 1,
			message: "Estado editado com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};