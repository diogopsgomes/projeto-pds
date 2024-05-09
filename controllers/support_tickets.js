const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getSupport_tickets = async (req, res) => {
	try {

		let idUserToken = req.user.id;

		let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken }});

		let tickets = await db.support_ticket.findAll({ where: {museummid: manager.museummid}});

		if (tickets.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem pedidos de suporte" });

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let response = {
			success: 1,
			length: tickets.length,
			results: tickets.map((support_ticket) => {
				return {
					id: support_ticket.stid,
					description: support_ticket.Description,
					statessid: support_ticket.support_statesssid,
					museuid: support_ticket.museummid,
					userid: support_ticket.useruid,
					priority: support_ticket.priority,
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

		let idUserToken = req.user.id;
		let id = req.params.id;

		let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken }});

		let ticket = await db.support_ticket.findOne({ where: { museummid: manager.museummid, stid: id}});

		if (!ticket) {
			return res.status(404).send({ success: 0, message: "Pedido de suporte inexistente" });
		}

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let response = {
			success: 1,
			length: 1,
			results: [
				{
					id: support_ticket.stid,
					description: support_ticket.Description,
					statessid: support_ticket.support_statesssid,
					museuid: support_ticket.museummid,
					userid: support_ticket.useruid,
					priority: support_ticket.priority,
				},
			],
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching Support Ticket:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addSupport_Ticket = async (req, res) => {
	try {
		let description = req.body.description;
		let museum = req.body.museum;
		let idUserToken = req.user.id;


		let user = await db.user.findByPk(idUserToken);
		if (!user) {
			return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
		}

		let newSupport_Ticket = await db.support_ticket.create({
			Description: description,
			support_statesssid: 1,
			museummid: museum,
			useruid: idUserToken,
			priority: 1,
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

exports.informPriority = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let priority = req.body.priority;

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let support_ticket = await db.support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		if (support_ticket.priority != 1) {
			return res.status(409).send({ success: 0, message: "Prioridade já atribuída" });
		}

		support_ticket.priority = priority;
		await support_ticket.save();

		let response = {
			success: 1,
			message: "Prioridade atribuída com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error informing priority:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.informEstimatedDeadline = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let deadline = req.body.deadline;

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let support_ticket = await db.support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		/*if (  Fazer a verificação  ) {
			return res.status(409).send({ success: 0, message: "Prazo estimado já atribuído" });
		}*/

		support_ticket.deadline = deadline; //Atribuir prazo
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

exports.removeSupport_Ticket = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let ticket = await db.support_ticket.findByPk(id);

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

		let support_ticket = await db.support_ticket.findByPk(id);

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

		let support_ticket = await db.support_ticket.findByPk(id);

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

exports.provideFeedback = async (req, res) => {
		try {
			let description = req.body.description;
			let evaluation = req.body.evaluation;
			let ticket = req.body.ticket;
			let userId = req.user.id;
	
	
			let user = await db.user.findByPk(userId);
			if (!user) {
				return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
			}

			let s_ticket = await db.support_ticket.findByPk(ticket);
        	if (!s_ticket || s_ticket.useruid !== userId) {
            	return res.status(403).send({ success: 0, message: "Apenas o autor do ticket pode fornecer feedback" });
        	}
	
			let new_Support_evaluation = await db.support_evaluation({
				se_description: description,
				se_evaluation: evaluation,
				support_ticketstid: ticket
			});
	
			let response = {
				success: 1,
				message: "Pedido de Suporte avaliado com sucesso",
			};
	
			return res.status(200).send(response);
		} catch (err) {
			console.error("Error avaliating Support Ticket:", err);
			return res.status(500).send({ error: err, message: err.message });
		}
};
