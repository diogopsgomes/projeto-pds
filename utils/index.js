const User = require('../models/user');

exports.isAdmin = async (id) => {
	try {
		const user = await User.findByPk(id);

		if (!user || user.type !== 'admin') return 0;

		return 1;
	} catch (err) {
		console.error("Error checking admin status:", err);
		return 0;
	}
};

exports.isManager = async (id) => {
	try {
		const user = await User.findByPk(id);

		if (!user || user.type !== 'manager') return 0;

		return 1;
	} catch (err) {
		console.error("Error checking manager status:", err);
		return 0;
	}
};