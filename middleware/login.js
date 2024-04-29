const jwt = require('jsonwebtoken');

exports.required = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, '#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e');
		req.user = decode;
		next();
	} catch (error) {
		return res.status(401).send({ message: 'Falha na autenticação' });
	}
};

exports.optional = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, '#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e');
		req.user = decode;
		next();
	} catch (error) {
		next();
	}
};
