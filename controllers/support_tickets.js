const Support_Ticket = require("../models/support_ticket");
const utils = require("../utils/index");


exports.getSupport_tickets = async (req, res) => {
	try {
		let tickets = await Support_Ticket.findAll();

		if (tickets.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem Pedidos de suporte" });

		let response = {
			success: 1,
			length: tickets.length,
			results: tickets.map((Support_Ticket) => {
				return {
					id: tickets.id,
                    description: tickets.description,
                    statessid: tickets.support_statesssid,
                    museuid: tickets.museummid,
                    userid: tickets.userid,
                    priority: tickets.priority,
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getSupport_Ticket = async (req, res) => {
	try {
		let id = req.params.id;

		let ticket = await Support_Ticket.findByPk(id);

		if (!ticket) {
			return res.status(404).send({ success: 0, message: "Pedido de suporte inexistente" });
		}

		let response = {
			success: 1,
			length: 1,
			results: [
				{
					id: ticket.id,
                    description: ticket.description,
                    statessid: ticket.support_statesssid,
                    museuid: ticket.museummid,
                    userid: ticket.userid,
                    priority: ticket.priority,
				},
			],
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching Support Tickets:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addSupport_Ticket = async (req, res) => {
	try {

		let description = req.body.description;
		let statessid = req.body.statessid;
		let museuid = req.body.museuid;
		let userid = req.body.userid;
		let priority = req.body.priority;
		let userId = req.user.id;

        //Verificar depois se vai ser necessario permissoes

		let user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
		}

        let newSupport_Ticket = await Support_Ticket.create({
			Description: description,
			support_statesssid: statessid,
			museummid: museuid,
			useruid: userId,
			priority: priority
		});

		let response = {
			success: 1,
			message: "Pedido de Suporte criado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error adding Support Ticket:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.informEstimatedDeadline = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let support_ticket = await Support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		if ( /* Fazer a verificação */ ) {
			return res.status(409).send({ success: 0, message: "Prazo estimado já atribuído" });
		}

		support_ticket.deadline = x; //Atribuir prazo
        await support_ticket.save();

		let response = {
			success: 1,
			message: "Prazo estimado atribuído com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error informing estimated deadline:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editSupport_Ticket = async (req, res) => {
};

exports.removeSupport_Ticket = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let ticket = await Support_Ticket.findByPk(id);

		if (!ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		let idOwner = ticket.useruid;

		let isManager = await utils.isManager(idUserToken); //Verificar
		if (!isManager && idOwner != idUserToken) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		await ticket.destroy();

		let response = {
			success: 1,
			message: "Ticket removido com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error removing ticket:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.concludeSupportTicket = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let support_ticket = await Support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		if (support_ticket.support_statesssid === 3) {
			return res.status(409).send({ success: 0, message: "Ticket já finalizado" });
		}

		support_ticket.support_statesssid = 3;
        await support_ticket.save();

		let response = {
			success: 1,
			message: "Ticket finalizado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error approving ticket:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.approveSupport_ticket = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let support_ticket = await Support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		if (support_ticket.support_statesssid === 2) {
			return res.status(409).send({ success: 0, message: "Ticket já aprovado" });
		}

		support_ticket.support_statesssid = 2;
        await support_ticket.save();

		let response = {
			success: 1,
			message: "Ticket aprovado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error approving ticket:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};
