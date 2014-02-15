/**
 * Created by fritz on 1/20/14.
 */
var syBookshelf = require('./base'),
	Entity = require('../lib/entity'),
	requireFn = require('../lib/requireFn'),
	User = requireFn('./user'),
	Starship, StarshipSet;

Starship = module.exports = syBookshelf.Model.extend({
	tableName: 'starship',
	fields: [
		'id', 'userid', 'itemtype', 'itemid', 'remark'
	],
	omitInJSON: ['userid'],

	fetch: function () {
		return Starship.__super__.fetch.apply(this, arguments)
			.then(function (starship) {
				if (!starship) return starship;
				var itemtype = starship.get('itemtype'),
					itemid = starship.get('itemid');
				return Entity
					.forge(itemtype, { id: itemid })
					.then(function (model) {
						if (!model) return model;
						return model.fetch();
					}).then(function (entity) {
						return starship.set({
							typename: Entity.getModelName(itemtype),
							item: entity
						});
					});
			});
	},

	user: function () {
		return this.belongsTo(User(), 'userid');
	}
}, {
	typesAllowed: [2, 3, 4]
});

StarshipSet = Starship.Set = syBookshelf.Collection.extend({
	model: Starship,

	fetch: function () {
		return StarshipSet.__super__.fetch.apply(this, arguments)
			.then(function (collection) {
				return collection.invokeThen('fetch')
					.then(function () {
						return collection;
					});
			});
	}
}, {
	finder: function (qb, query) {
		['id', 'userid', 'itemtype', 'itemid'].forEach(function (k) {
			if (k in query) {
				qb.where(k, query[k]);
			}
		});
	}
});
