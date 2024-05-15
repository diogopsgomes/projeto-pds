const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAllTicketStatus = async (req, res) =>{
    try{
        let idUserToken = req.user.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let status = await db.ticket_status.findAll();

        if (status.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem status de tickets" });

        let response = {
			success: 1,
			length: status.length,
			results: status.map((ticket_status) => {
				return {
                    id: ticket_status.ts_id,
                    description: ticket_status.desc_ticket_status,
				};
			}),
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getTicketStatus = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let id = req.params.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let status = await db.ticket_status.findByPk(id);

        if (!status)
			return res.status(404).send({ success: 0, message: "Status inexistente" });

        let response = {
            success: 1,
            length: 1,
            results: [
                {
                    id: ticket_status.ts_id,
                    description: ticket_status.desc_ticket_status,
                },
            ],
        };

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addTicketStatus = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let description = req.body.description;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let new_Ticket_status = await db.ticket_status.create({
            desc_ticket_status: description,
		});
	
		let response = {
			success: 1,
			message: "Status de ticket adicionado com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeTicketStatus = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let id = req.params.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let status = await db.ticket_status.findByPk(id);

        if (!status)
			return res.status(404).send({ success: 0, message: "Status inexistente" });

        await status.destroy();

		let response = {
			success: 1,
			message: "Status removido com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editTicketStatus = async (req, res) =>{
    try{
        let id = req.params.id;
		let idUserToken = req.user.id;
        let description = req.body.description;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let status = await db.ticket_status.findByPk(id);

        if (!status)
			return res.status(404).send({ success: 0, message: "Status inexistente" });

        status.desc_ticket_status = description;

        await status.save();

		let response = {
			success: 1,
			message: "Status editado com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};