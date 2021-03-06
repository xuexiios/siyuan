/**
 * Created by cin on 1/19/14.
 */
var syBookshelf = require('./base'),
	CoStatus, CoStatuses;

CoStatus = module.exports = syBookshelf.Model.extend({
	tableName: 'co_status',
	fields: ['id', 'name'],

	saving: function () {
		return CoStatus.__super__.saving.apply(this, arguments);
	}
});

CoStatuses = CoStatus.Set = syBookshelf.Collection.extend({
	model: CoStatus
});