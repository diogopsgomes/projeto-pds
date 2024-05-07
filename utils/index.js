const User = require("../models/user");
const UserType = require("../models/user_type");

exports.isAdmin = async (id) => {
	try {
		const user = await User.findByPk(id, { include: UserType });

		if (!user || !user.UserType || user.UserType.ut_description !== "admin") return 0;

		return 1;
	} catch (err) {
		console.error("Error checking admin status:", err);
		return 0;
	}
};

exports.isManager = async (id) => {
	try {
		const user = await User.findByPk(id, { include: UserType });

		if (!user || !user.UserType || user.UserType.ut_description !== "manager") return 0;

		return 1;
	} catch (err) {
		console.error("Error checking manager status:", err);
		return 0;
	}
};
