const db = require('../config/mysql');

exports.isAdmin = async (id) => {
    try {
        const user = await db.user.findByPk(id, { include: db.user_type });

		if (!user || !user.user_type || user.user_type.ut_description !== "admin") return 0;

        return 1;
    } catch (err) {
        console.error("Error checking admin:", err);
        return 0;
    }
};

exports.isManager = async (id) => {
	try {
		const userMuseum = await db.usermuseum.findOne({ where: { useruid: id }});

		if (!userMuseum) return 0;

		return 1;
	} catch (err) {
		console.error("Error checking manager:", err);
		return 0;
	}
};

