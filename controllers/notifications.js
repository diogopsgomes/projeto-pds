const db = require('../config/mysql');
const utils = require('../utils/index');

exports.getUnreadNotifications = async (req, res) => {
    try{
        let idUserToken = req.user.id;

        let notifications = await db.notification.findAll({ where: { useruid: idUserToken, notification_statensid: 1 }});

        if (notifications.lenght === 0) {
			return res.status(404).send({ success: 0, message: "Não existem notificações por ler" });
		}

        let response = {
			success: 1,
			length: notifications.length,
			results: notifications.map((notification) => {
				return {
                    type: notification.notification_typentid,
					id: notification.nid,
					description: notification.n_description,
                    state : notification.notification_statensid
				};
			}),
		};
        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getReadNotifications = async (req, res) => {
    try{
        let idUserToken = req.user.id;

        let notifications = await db.notification.findAll({ where: { useruid: idUserToken, notification_statensid: 2 }});

        if (notifications.length === 0) {
			return res.status(404).send({ success: 0, message: "Não existem notificações" });
		}

        let response = {
			success: 1,
			length: notifications.length,
			results: notifications.map((notification) => {
				return {
                    type: notification.notification_typentid,
					id: notification.nid,
					description: notification.n_description,
                    state : notification.notification_statensid
				};
			}),
		};
        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getAllNotifications = async (req, res) =>{
    try{

		let idUserToken = req.user.id;

        let notifications = await db.notification.findAll({ where: { useruid: idUserToken }});

        if (notifications.lenght === 0) {
			return res.status(404).send({ success: 0, message: "Não existem notificações" });
		}

        let response = {
			success: 1,
			length: notifications.length,
			results: notifications.map((notification) => {
				return {
                    type: notification.notification_typentid,
					id: notification.nid,
					description: notification.n_description,
                    state : notification.notification_statensid
				};
			}),
		};
        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addNotifications = async (description, type, user) =>{
    try{

        let newNotification = await db.notification.create({
            n_description: description,
            notification_typentid: type,
            useruid: user,
            notification_statensid: 1
        });

    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

