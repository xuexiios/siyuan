var _ = require('underscore');

module.exports = function (req, res, next) {
	var method = req.method,
		query = req.query;

	// method GET
	if (method === 'GET') {
		// limit
		var limit = 10;
		if ('limit' in query) {
			limit = ~~query['limit'];
		}
		query['limit'] = limit;

		// offset, page
		var offset = 0, page = null;
		if ('offset' in query) {
			offset = ~~query['offset'];
		} else if ('page' in query) {
			page = Math.max(1, ~~query['page']);
			offset = Math.max(0, limit * (page - 1));
		}
		query['page'] = page;
		query['offset'] = offset;

		// order
		var orders = [];
		if ('orders' in query) {
			var arr = query['orders'];
			if (!_.isArray(arr)) arr = [arr];
			arr.forEach(function (key) {
				var order;
				if (key[0] === '-') {
					key = key.substr(1);
					order = [key, 'desc'];
				} else {
					order = [key, 'asc'];
				}
				orders.push(order);
			});
		}
		orders.push(['id', 'desc']);	// default
		query['orders'] = orders;

		// fuzzy
		query['fuzzy'] = query['fuzzy'] == '1';

		// applied
		query['applied'] = 0;
	}

	next();
};
