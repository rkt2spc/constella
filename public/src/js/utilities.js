var Utils = {
	groupedTransform: function(data, propKey) {

		var groupKeys = [];
		groupKeys = data.map((item) => item[propKey]);
		groupKeys = Array.from(new Set(groupKeys));

		var groupedData = {};
		groupKeys.forEach((key) => {

			groupedData[key] = data.filter((item) => item[propKey] === key);
		});

		return groupedData;
	},

	populate: function(data1, propKey) {
		
		return {
			with: function(data2) {
				return {
					where: function(comparer) {
						
						return data1.map((item1) => {
							item1[propKey] = data2.find((item2) => comparer(item1, item2));
							return item1;
						});
					}
				};
			}
		};
	},

	formatCurrency: function(input, unit) {
		input = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' ' + unit;
		return input;
	},

	formatRouteDescription: function(origin, destination, departure) {

		var routeDescription = 'All flights';

		routeDescription += (origin)? ' from <b>' + origin.name + '</b>' : '';
		routeDescription += (destination)? ' to <b>' + destination.name + '</b>' : '';
		routeDescription += (departure)? ' leaving on <b>' + departure.toLocaleDateString() + '</b>' : '';

		return routeDescription;
	}
};