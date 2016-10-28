function getRandomInt(min, max) {
  	min = Math.ceil(min);
  	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min;
}
function selectRandom(arr) {

	var index = getRandomInt(0, arr.length);
	return arr[index];
}
function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
function countDigits(num) {
	var d = 0, temp = num;
	while (temp / 10) {
		d++;
		temp = temp / 10;
	}

	return d;
}

function generateTask(index, origin, destination, departure, arrival) {
	
	let flight = {
		_id: formatNumberLength(index, 8),
		origin: origin,
		destination: destination,
		departure: departure,
		arrival: arrival,
		seats: [{
			_class: "C",
			price: 2000000,
			capacity: 50
		}, {
			_class: "D",
			price: 1700000,
			capacity: 50
		}, {
		  	_class: "M",
		  	price: 1000000,
		  	capacity: 200
		}, {
			_class: "N",
			price: 700000,
			capacity: 200
		}, {
			_class: "P",
			price: 300000,
			capacity: 50
		}, {
			_class: "U",
			price: 500000,
			capacity: 50
		}]
	};

	return function() {

		$.ajax({
			url: '/api/flights/BOT' + flight._id,
			method: 'PUT',
			data: flight,
			succes: (response) => console.log('generated:', response.result),
			error: (xhr, textStatus, errorThrown) => console.log(xhr.responseJSON)
		});	
	};
}


var generateData = function(nDate) {
	if (!async) return console.log('please install async');
	if (!$) return console.log('please install jquery');

	async.waterfall([
		function(callback) {

			var promise = new Promise((fulfill, reject) => {
				$.ajax({
					url: '/api/locations',
					method: 'GET',
					success: fulfill,
					error: reject
				});
			});

			promise
				.then((response) => callback(null, response.result))
				.catch((xhr, textStatus, errorThrown) => callback(xhr.responseJSON));
			
		},
		function(locations, callback) {
			var timeSeed = new Date(),
				interval = 12, //hours
				nLoop = 24 * nDate / interval;

			var index = 1, nDigit = 8;
			timeSeed.setHours(0, 0, 0, 0);

			console.log('nLoop', nLoop);
			console.log('locations', locations.length);
			var tasks = [];
			for (let i = 0; i < nLoop; ++i) {

				let departure = timeSeed.getTime(),
					arrival = departure + (selectRandom([2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]) * 3600 * 1000);

				for (let j = 0; j < locations.length; ++j) {
					for (let k = 0; k < locations.length; ++k) {
						if (j === k) continue;

						tasks.push(generateTask(index++, locations[j]._id, locations[k]._id, departure, arrival));
					}
				}

				timeSeed.setTime(departure + interval * 3600 * 1000);
			}

			callback(null, tasks);
		},
		function(tasks, callback) {
			
			tasks.forEach((task) => {
				task();
			});
		}]
	);
};