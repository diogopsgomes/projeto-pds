const db = require('../config/mysql');
const event = require('../models/event');
const utils = require("../utils/index");

exports.getAllTickets = async (req, res) => {
    try {
        let idUserToken = req.user.id;

        let isAdmin = await utils.isAdmin(idUserToken);
        if (isAdmin) {
            let tickets = await db.ticket.findAll();
            if (tickets.length === 0)
                return res.status(404).send({ success: 0, message: "Não existem tickets" });

            let response = {
                success: 1,
                length: tickets.length,
                results: tickets.map((ticket) => {
                    return {
                        id: ticket.tid,
                        purchase_date: ticket.ticket_purchase_date,
                        event: ticket.eventeid,
                        user: ticket.useruid,
                        status: ticket.ticket_statusts_id,
                    };
                }),
            };

            return res.status(200).send(response);
        }

        let tickets;
        let isManager = await utils.isManager(idUserToken);
        if (isManager) {
            let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
            tickets = await db.ticket.findAll({
                include: [{
                    model: db.event,
                    where: { museummid: manager.museummid }
                }]
            });
        } else {
            tickets = await db.ticket.findAll({ where: { useruid: idUserToken } });
        }

        if (tickets.length === 0)
            return res.status(404).send({ success: 0, message: "Não existem tickets" });

        let response = {
            success: 1,
            length: tickets.length,
            results: tickets.map((ticket) => {
                return {
                    id: ticket.tid,
                    purchase_date: ticket.ticket_purchase_date,
                    event: ticket.eventeid,
                    user: ticket.useruid,
                    status: ticket.ticket_statusts_id,
                };
            }),
        };

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.getAllTicketsByEvent = async (req, res) => {
    try {
        let idUserToken = req.user.id;
        let id = req.params.id;

        let isAdmin = await utils.isAdmin(idUserToken);
        if (isAdmin) {
            let tickets = await db.ticket.findAll({ where: { eventeid: id }});
            if (tickets.length === 0)
                return res.status(404).send({ success: 0, message: "Não existem tickets para este evento" });

            let response = {
                success: 1,
                length: tickets.length,
                results: tickets.map((ticket) => {
                    return {
                        id: ticket.tid,
                        purchase_date: ticket.ticket_purchase_date,
                        event: ticket.eventeid,
                        user: ticket.useruid,
                        status: ticket.ticket_statusts_id,
                    };
                }),
            };

            return res.status(200).send(response);
        }

        let tickets;
        let isManager = await utils.isManager(idUserToken);
        if (isManager) {
            let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
            tickets = await db.ticket.findAll({
                include: [{
                    model: db.event,
                    where: { museummid: manager.museummid,eventeid: id }
                }]
            });
        } else {
            tickets = await db.ticket.findAll({ where: { useruid: idUserToken, eventeid: id } });
        }

        if (tickets.length === 0)
            return res.status(404).send({ success: 0, message: "Não existem tickets para este evento" });

        let response = {
            success: 1,
            length: tickets.length,
            results: tickets.map((ticket) => {
                return {
                    id: ticket.tid,
                    purchase_date: ticket.ticket_purchase_date,
                    event: ticket.eventeid,
                    user: ticket.useruid,
                    status: ticket.ticket_statusts_id,
                };
            }),
        };

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.addTickets = async (req, res) =>{
    try {
        let idUserToken = req.user.id;
        let purchase_date = req.body.purchase_date;
        let eventId = req.body.event;
        let price = req.body.price;
        let quantity = req.body.quantity;

        let event = await db.event.findByPk(eventId);
        if(!event) return res.status(404).send({ success: 0, message: "Evento inexistente" });

        if(quantity <= 0) return res.status(406).send({ success: 0, message: "Quantidade inválida" });
       
        for(let i = 0; i < quantity; i++){
            let new_Ticket = await db.ticket.create({
                ticket_purchase_date: purchase_date,
                ticket_price: price,
                eventeid: eventId,
                ticket_statusts_id: 1,
                useruid: idUserToken
            });
        }
	
		let response = {
			success: 1,
			message: "Ticket comprado com sucesso",
		};

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.editPriceCategory = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let price = req.body.price;
        let eventId = req.params.id;
        let ticketCategory = req.body.id;

        let isManager = await utils.isManager(idUserToken);
        if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });

        let event = await db.event.findByPk(eventId);

		if (!event) {
			return res.status(404).send({ success: 0, message: "Evento inexistente" });
		}

		if (event.museummid !== manager.museummid) {
            return res.status(403).send({ success: 0, message: 'Ticket não pertence ao seu museu' });
        }

        event.event_price = price;
        await event.save();

		let response = {
			success: 1,
			message: "Preço editado com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};
