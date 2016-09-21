angular.module('app.controllers', [])

.controller('bandPlanCtrl', function($scope, jsonReaderService, bandFactory) {

	//show main bands (LF, MF, HF...)
	$scope.bands = jsonReaderService.findMainBands();

	$scope.showMainBandDetail = function(band){
		bandFactory.set(band);
	};
})

.controller('mainBandCtrl', function($scope, bandFactory, jsonReaderService, subBandFactory) {

	$scope.parameter = bandFactory.get();

	// show bands (1.8, 3.5, 7, 10 Mhz...) for a selected band plan (HF)
	$scope.subBands = jsonReaderService.findSubBandsWithLimits(bandFactory.get());

	// show only bands who appears in bands
	$scope.modes = jsonReaderService.findFilteredModes(bandFactory.get());

	$scope.showBandDetail = function(band) {
		subBandFactory.set(band);
	};
})

.controller('bandDetailCtrl', function($scope, subBandFactory, jsonReaderService) {
	$scope.details = jsonReaderService.findBandDetailsByLabel(subBandFactory.get());
})

.controller('qrpCtrl', function($scope, jsonReaderService) {
	$scope.ssbQrp = jsonReaderService.getAllQrpSsb();
	$scope.cwQrp = jsonReaderService.getAllQrpCw();
	$scope.remark = "Tout le monde n'est pas d'accord sur la définition de la puissance QRP. La plupart des adeptes du trafic QRP considèrent que pour l'émission en code Morse (CW), en modulation d'amplitude (AM), en modulation de fréquence (FM), et pour la transmission de données, la puissance de sortie de l'émetteur doit être de 5W ou moins, le maximum raisonnable pour la bande latérale unique (BLU) n'est pour l'instant pas tranché. D'autres pensent que la puissance PEP (Peak Envelope Power) doit être de 10W ou moins. En règle générale, le trafic QRP se fait même avec moins de 5W, parfois avec seulement 100mW ou en dessous. (source: Wikipédia)";
})

.controller('qrssCtrl', function($scope, jsonReaderService) {
	$scope.title = "QRSS";
	$scope.header = "Centre d'activité QRSS";
	$scope.frequencies = jsonReaderService.getAllQrss();
	$scope.remark = "Kesako QRSS ? C’est du morse très lent  ! Vous émettez à très basse vitesse (6 secondes pour un point) et à l’autre bout l’écouteur utilise un logiciel pour visualiser ce qui a été reçu d’un coup d’oeil, ce qui permet de s’affranchir des phénomènes de QSB et de déceler des simples « traces » qui n’auraient pas été audibles. (source: blog de Laurent - F1JKJ)";
})

.controller('psk31Ctrl', function($scope, jsonReaderService) {
	$scope.title = "PSK31";
	$scope.header = "Centre d'activité PSK31";
	$scope.frequencies = jsonReaderService.getAllPsk31();
})

.controller('jt9Ctrl', function($scope, jsonReaderService) {
	$scope.title = "JT9";
	$scope.header = "Centre d'activité JT9";
	$scope.frequencies = jsonReaderService.getAllJt9();
})

.controller('jt65Ctrl', function($scope, jsonReaderService) {
	$scope.title = "JT65";
	$scope.header = "Centre d'activité JT65";
	$scope.frequencies = jsonReaderService.getAllJt65();
})

.controller('sstvCtrl', function($scope, jsonReaderService) {
	$scope.title = "SSTV";
	$scope.header = "Centre d'activité SSTV";
	$scope.frequencies = jsonReaderService.getAllSstv();
	$scope.remark = "Tous modes images analogiques ou digitaux dans la bande passante appropriée, par exemple SSTV ou FAX";
})

.controller('digitalVoiceCtrl', function($scope, jsonReaderService) {
	$scope.title = "Voix numérique";
	$scope.header = "Centre d'activité voix numérique";
	$scope.frequencies = jsonReaderService.getAllDigitalVoice();
})

.controller('emergencyCtrl', function($scope, jsonReaderService) {
	$scope.title = "Communication d'urgence";
	$scope.header = "Centre d'activité communications d'urgence";
	$scope.frequencies = jsonReaderService.getAllEmergency();
	$scope.remark = "Ces fréquences doivent rester libres et sont utilisées uniquement en cas de catastrophes naturelles."
})

.controller('uftCtrl', function($scope, jsonReaderService) {
	$scope.title = "Union Française des Télégraphistes";
	$scope.header = "Centre d'activité CW de l'UFT";
	$scope.frequencies = jsonReaderService.getAllUft();
})

.controller('rstCodeCtrl', function($scope, rstCodeService) {
	$scope.codes = rstCodeService.getAll();
})

.controller('contestsCtrl', function($scope, jsonReaderService) {
	$scope.ssbContests = jsonReaderService.findAllSsbContests();
	$scope.cwContests =	jsonReaderService.findAllCwContests();
})

.controller('fav22Ctrl', function($scope, fav22Service) {

	$scope.solutions = null;

	$scope.categories = fav22Service.getAllCategories();

	$scope.modes = fav22Service.getAllModes();

	// $scope.categorySelected = {
	// 	category: $scope.categories[0]
	// };

	$scope.categorySelected = {
		category: { }
	};


	$scope.showSolution = function(index) {
		fav22Service.showItem(index, $scope.solutions);
	};

	$scope.hideSolution = function(index) {
		fav22Service.hideItem(index, $scope.solutions);
	};

	$scope.isEncrypted = function(lesson) {
		var result = lesson.indexOf("codé");
		return result > 0;
	};

	$scope.findByCategory = function(category) {
		var all = fav22Service.getAll();
		$scope.solutions = fav22Service.findLessonsByCategory(category, all);
	};

	$scope.findByMode = function(mode) {
		var filteredData = $scope.solutions.length > 0 ? angular.copy($scope.solutions) : fav22Service.getAll();
		var data = fav22Service.findLessonsByMode(mode, filteredData);
		if(data.length == 0) {
			filteredData = fav22Service.getAll();
			data = fav22Service.findLessonsByMode(mode, filteredData);
		}
		$scope.solutions = data;
	};

	$scope.formatTitle = function(title) {
		return fav22Service.formatTitle(title);
	};
})

.controller('aboutCtrl', function($scope) {

})