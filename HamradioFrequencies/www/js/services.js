angular.module('app.services', [])

.factory('bandFactory', [function(){
	var _savedData = {};

	function set(data) {
		console.log('factory set data: ');
		console.log(data);
		_savedData = data;
	};

	function get() {
		console.log('factory get data: ' + _savedData);
		return _savedData;
	};

	return {
		set: set,
		get: get
	};
}])

.factory('subBandFactory', [function(){
	var _savedData = {};

	function set(data) {
		console.log('sub band factory set data: ');
		console.log(data);
		_savedData = data;
	};

	function get() {
		console.log('sub band factory get data: ');
		console.log(_savedData);
		return _savedData;
	};

	return {
		set: set,
		get: get
	};
}])

.service('fav22Service', [function(){
	var _speed = 'Vitesse';

	function findDayFromLesson(lesson) {
		var items = lesson.lesson.split(' ');
		return items[0];
	};

	function findSpeedFromLesson(lesson) {
		var items = lesson.lesson.split(' ');
		return items[items.length - 2];
	};

	function findModeFromLesson(lesson) {
		var items = lesson.lesson.split(' ');
		return items[items.length - 1];
	};

	function exists(list, obj) {
		for(var i=0; i<list.length; i++){
			if(list[i].day == obj.day && list[i].speed == obj.speed) {
				return true;
			}
		}
		return false;
	};

	this.getAll = function() {
		return fav22;
	};

	this.getAllCategories = function() {
		var categories = [];
		_.each(fav22, function(item) {

			var dayFound = findDayFromLesson(item);
			var speedFound = findSpeedFromLesson(item);

			var obj = {
				day: dayFound,
				speed: speedFound
			};

			if(!exists(categories, obj)) {
				categories.push(obj);
			}
		});
		return categories;
	};

	this.getAllModes = function() {
		var modes = [];
		_.each(fav22, function(item) {
			var mode = findModeFromLesson(item);
			modes.push(mode);
		});
		return _.uniq(modes);
	};

	this.findLessonsByCategory = function(category, data) {
		var lessons = [];
		_.each(data, function(item) {
			var dayFound = findDayFromLesson(item);
			var speedFound = findSpeedFromLesson(item);
			if(category.day == dayFound && category.speed == speedFound) {
				lessons.push(item);
			}
		});
		return lessons;
	};

	this.findLessonsByMode = function(mode, data) {
		var lessons = [];
		_.each(data, function(item) {
			var modeFound = findModeFromLesson(item);
			if(modeFound == mode) {
				lessons.push(item);
			}
		});
		return lessons;
	};

	this.showItem = function(index, data) {
		data[index].visible = true;
	};

	this.hideItem = function(index, data) {
		data[index].visible = false;
	};

	this.formatTitle = function(lesson) {
		var pos = lesson.indexOf(_speed);
		var str = lesson.substring(0, pos).trim();
		return str;
	};
}])

.service('rstCodeService', [function(){
	this.getAll = function() {
		return rstCode;
	};
}])

.service('jsonReaderService', [function(){

	// table width in percent
	var _tableWidthPercent = 98;

	// right border class for the last TD element
	var _rightBorderClass = "border-right";

	function findMinFrequency(frequencies) {
		var minFrequency = _.min(frequencies, function(freqs) {
			return freqs.start;
		});
		return minFrequency.start;
	};

	function findMaxFrequency(frequencies) {
		var maxFrequency = _.max(frequencies, function(freqs) {
			return freqs.end;
		});
		return maxFrequency.end;
	};

	function findModeById(modeId) {
		return _.findWhere(bandplan.modes, { id: modeId });
	};

	function findModeIdsByBandLimit(bandLimit) {
		var modeIds = [];
		_.each(bandplan.bands, function(band) {
			_.each(band.frequencies, function(frequency) {
		    	if(frequency.start >= bandLimit.start && frequency.end <= bandLimit.end) {
		    		modeIds.push(frequency.modeId);
		    	}
		  	});
		});

		var distinctModeIds = _.uniq(modeIds);
		return distinctModeIds;
	};

	// returns column size, background color and class (only for the latest)
	// for each frequency part
	function calculateSizeAndColor(frequencies, totalBandWidth) {
		var result = [];
		var index = 1;

		_.each(frequencies, function(freq) {
			var diff = freq.end - freq.start;
			var percent = diff * _tableWidthPercent / totalBandWidth;
			var mode = findModeById(freq.modeId);
			var rightBorderClass = (index == frequencies.length) ? _rightBorderClass : '';

			result.push({
				size: percent.toFixed(1),
				bgColor: mode.background,
				borderClass: rightBorderClass
			});

			index++;
		});
		return result;
	};

	// find and add a 'mode' object into each item
	function addCorrespondingMode(items) {
		_.each(items, function(item) {
			var modeFound = _.findWhere(bandplan.modes, { id: item.modeId });
			item.mode = modeFound;
		});
	};

	function findContestsByModeId(modeId) {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.contests.length > 0) {

				var ssbContests = _.where(band.contests, { modeId: modeId});
				if(ssbContests.length > 0) {
					var obj = {
						label: band.label,
						contests: ssbContests
					};

					_.each(obj.contests, function(contest) {
						contest.mode = findModeById(contest.modeId);
					});
					result.push(obj);
				}
			}
		});
		return result;
	}

	function findQrpByModeId(modeId) {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.qrp.length > 0) {
				var qrpObj = _.where(band.qrp, { modeId: modeId});
				if(qrpObj != null) {
					for(var i=0; i<qrpObj.length; i++) {
						var obj = {
							frequency: qrpObj[i].frequency,
							mode: findModeById(qrpObj[i].modeId)
						};
						result.push(obj);
					}
				}
			}
		});
		return result;
	}

	// function convertKiloToMegaHertz(frequency) {
	// 	var number = parseInt(frequency, 10);

	// 	if(number >= 10000) {
	// 		return number / 1000;
	// 	}
	// 	return frequency;
	// };

	// returns main band: LF, MF, HF...
	this.findMainBands = function() {
		var bands = [];
		_.each(bandplan.bandplans, function(band) {
			bands.push(band);
		});
		return bands;
	};

	// return sub bands for a specific limits
	this.findSubBandsWithLimits = function(bandLimit) {
		var bandsFound = [];
		_.each(bandplan.bands, function(band) {
			var minFreq = findMinFrequency(band.frequencies);
			var maxFreq = findMaxFrequency(band.frequencies);

			if(minFreq >= bandLimit.start && maxFreq <= bandLimit.end) {
				var totalBandWidth = maxFreq - minFreq;

				bandsFound.push({
					band: band.label,
					frequency: {
						start: minFreq,
						end: maxFreq
					},
					frequencies: calculateSizeAndColor(band.frequencies, totalBandWidth)
				});
			}
		});
		return bandsFound;
	};

	// returns all details for a selected sub-band (ex: 160)
	this.findBandDetailsByLabel = function(bandLabel) {
		var bandFound =  _.findWhere(bandplan.bands, { label: bandLabel });
		var band = angular.copy(bandFound);
		addCorrespondingMode(band.frequencies);
		return band;
	};

	this.findFilteredModes = function(bandLimit) {
		var modeIds = findModeIdsByBandLimit(bandLimit);
		var modeFound = [];
		_.each(modeIds, function(modeId) {
			modeFound.push(findModeById(modeId));
		});

		return modeFound;
	};

	this.getAllModes = function() {
		return _.where(bandplan.modes, { visible: true });
	};

	this.getAllQrpSsb = function() {
		return findQrpByModeId(9);
	};

	this.getAllQrpCw = function() {
		return findQrpByModeId(1);
	};

	this.getAllQrss = function() {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.qrss != null) {
				result.push(band.qrss);
			}
		});
		return result;
	};

	this.getAllPsk31 = function() {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.psk31 != null) {
				result.push(band.psk31);
			}
		});
		return result;
	};

	this.getAllSstv = function() {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.sstv != null) {
				result.push(band.sstv);
			}
		});
		return result;
	};

	this.getAllJt9 = function() {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.jt9 != null) {
				result.push(band.jt9);
			}
		});
		return result;
	};

	this.getAllJt65 = function() {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.jt65 != null) {
				result.push(band.jt65);
			}
		});
		return result;
	};

	this.getAllDigitalVoice = function() {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.digitalVoice != null) {
				result.push(band.digitalVoice);
			}
		});
		return result;
	};

	this.getAllEmergency = function() {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.emergency != null) {
				result.push(band.emergency);
			}
		});
		return result;
	};

	this.getAllUft = function() {
		var result = [];
		_.each(bandplan.bands, function(band) {
			if(band.uft != null) {
				result.push(band.uft);
			}
		});
		return result;
	};

	this.findAllCwContests = function() {
		return findContestsByModeId(1);
	};

	this.findAllSsbContests = function() {
		return findContestsByModeId(9);
	};
}]);

