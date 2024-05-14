const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAllSupportStates = async (req, res) =>{
    try{
        let idUserToken = req.user.id;

        let isManager = await utils.isManager(idUserToken);
		if (!isManager) return res.status(403).send({ success: 0, message: 'Sem permissão' });

    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}

};
