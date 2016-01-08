$(function(){

var mapImgHandle = document.getElementById('map-img');
var jsonData = {};

var baseUrl = window.location.pathname.split('/');
baseUrl.pop();
baseUrl = baseUrl.join('/');

window.addEventListener("hashchange", hashHasChanged, false);

loadData(getHashParams());

var params = getHashParams();
if(params.wells){
	if(params.wells == 1){
		document.getElementById('wells-checkbox').checked = true;
	}else{
		document.getElementById('wells-checkbox').checked = false;
	}
}

if(params.quartz){
	if(params.quartz == 1){
		document.getElementById('quartz-checkbox').checked = true;
	}else{
		document.getElementById('quartz-checkbox').checked = false;
	}
}

$('#map-options').on('change', 'input[type=checkbox]', function(e) {
	if (this.checked) {
		urlSetParam(this.getAttribute('data-id'), 1);
	} else {
		urlSetParam(this.getAttribute('data-id'), 0);
	}
});

if (mapImgHandle.addEventListener) {
	// IE9, Chrome, Safari, Opera
	mapImgHandle.addEventListener("mousewheel", mouseWheelHandler, false);
	// Firefox
	mapImgHandle.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
}else{
	// IE 6/7/8
	mapImgHandle.attachEvent("onmousewheel", mouseWheelHandler);
}

$('#primary-map-selector').on('change', function(e) {
	var params = getHashParams();
	var hash = '#';
	params.mapurl = this.value;
	$.each(params, function(key, value) {
		hash = hash+key+'='+value+'&';
	});

	hash = hash.substring(0, hash.length-1);
	window.location.hash = hash;
});

$('#secondary-map-selector').on('change', function(e) {
	var params = getHashParams();
	var hash = '#';
	params.mapurl = this.value;
	$.each(params, function(key, value) {
		hash = hash+key+'='+value+'&';
	});

	hash = hash.substring(0, hash.length-1);
	window.location.hash = hash;
});

if (window.top!=window.self) {
	console.log(document.referrer.split('/')[2]);
	if(document.referrer.split('/')[2] != 'codex-network.com'){
		if(getHashParams().sidebar){
			if(getHashParams().sidebar == '1'){
				document.body.className = document.body.className + " iframe iframe-nocodex";
			}else{
				document.body.className = document.body.className + " iframe-nosidebar iframe-nocodex";
			}
		}else{
			document.body.className = document.body.className + " iframe iframe-nocodex";
		}
	}else{
		document.body.className = document.body.className + " iframe";
	}
}

$('#share-modal').on('show.bs.modal', function (e) {
	var currentUrl = window.location.href;
	$('#embed-input').val('<iframe src="'+currentUrl+'" width="962" height="742" border="0" frameborder="0" allowTransparency="true"></iframe>');
});

$('#embed-input').on('click', function() {
	this.select();
});

$('input[type=radio][name="embed-radio"]').on('change', function() {
	var currentUrl = window.location.href;
	var embedInputHandle = $('#embed-input');

	if($(this).val() == 'frame') {
		embedInputHandle.val('<iframe src="'+currentUrl+'" width="962" height="742" border="0" frameborder="0" allowTransparency="true"></iframe>');
	}else{
		embedInputHandle.val('<iframe src="'+currentUrl+'&sidebar=0" width="683" height="696" border="0" frameborder="0" allowTransparency="true"></iframe>');
	}
});

var arrOfImg = ['img/maps/empty/1-0.jpg','img/maps/empty/1.jpg','img/maps/empty/1-1.jpg','img/maps/empty/1-1-1.jpg','img/maps/empty/1-1-1-1.jpg','img/maps/empty/1-1-2.jpg','img/maps/empty/1-1-3.jpg','img/maps/empty/1-1-3-1.jpg','img/maps/empty/1-1-4.jpg','img/maps/empty/1-1-4-1.jpg','img/maps/empty/1-1-5.jpg','img/maps/empty/1-2.jpg','img/maps/empty/1-2-1.jpg','img/maps/empty/1-2-1-1.jpg','img/maps/empty/1-2-2.jpg','img/maps/empty/1-2-2-1.jpg','img/maps/empty/1-2-3.jpg','img/maps/empty/1-2-3-1.jpg','img/maps/empty/1-2-3-2.jpg','img/maps/empty/1-2-4.jpg','img/maps/empty/1-2-4-1.jpg','img/maps/empty/1-2-4-2.jpg','img/maps/empty/1-3.jpg','img/maps/empty/1-3-1.jpg','img/maps/empty/1-3-2.jpg','img/maps/empty/1-3-2-1.jpg','img/maps/empty/1-3-3.jpg','img/maps/empty/1-3-3-1.jpg','img/maps/empty/1-3-4.jpg','img/maps/empty/1-3-5.jpg','img/maps/empty/1-3-5-1.jpg'];
var loadedSoFar = 0;
var arrayLength = arrOfImg.length;
window.onload = function() {
	setTimeout(function() {
		for(var i = 0; i < arrayLength; i++) {
		    var img = new Image();

		    img.src = arrOfImg[i];

		    img.onload = function() {
		        updateProgress();
		    };
		}
	}, 1000);
};

var lynHandle = document.getElementById('lyn-anim');
var lynAnim = new JSMovieclip(document.getElementById('lyn-anim'), {
    framerate : 25,
    direction : 'v',
    frames_number : 16,
    width : 150,
    height : 64
}).play(true);

function findObjById(source, id) {
	for (var i = 0; i < source.length; i++) {
		if (source[i].id === id) {
			return source[i];
		}
	}
}

function urlSetParam(param, paramValue){
	var hashParams = getHashParams();
	var newHash = '';

	if(param in hashParams){
	    $.each(hashParams, function(key, value) {
	    	if (key == param) {
	    		newHash += '&'+key+'='+paramValue;
	    	}else{
	    		newHash += '&'+key+'='+value;
	    	}
	    });
	}else{
	    $.each(hashParams, function(key, value) {
			newHash += '&'+key+'='+value;
	    });
	    newHash += '&'+param+'='+paramValue;
	}
	window.location.hash = '#'+newHash.substring(1);
}

function hashHasChanged() {
    var options = getHashParams();

    loadData(options);
}

function loadData(options){
	if(sessionStorage.getItem("jsonData")) {
	    jsonData = JSON.parse(sessionStorage.getItem("jsonData"));
	    dropdownLoader(options.mapurl, jsonData);
	    mapLoader(options, jsonData);
	} else {
		var jqxhr = $.ajax({
			url: "data.json",
			datatype: "json",
			beforeSend: function( xhr ) {
				xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
			}
		});

		jqxhr.done(function(jsonData) {
			jsonData = JSON.parse(jsonData);
			sessionStorage.setItem("jsonData", JSON.stringify(jsonData));
			mapLoader(options, jsonData);
		});

		jqxhr.fail(function(xhr, status, error) {
			console.log(xhr);
			console.log('status : '+status);
			console.log('error : '+error);
		});
	}
}

function dropdownLoader(filter, jsonData){
	filter = filter.substring(0,3);

	var mapData = [];
	jsonData.maps.forEach(function(map) {
		mapData.push({'id': map.id,'name': map.name});
	});

	var filteredMapData = mapData.filter(function(item) {
		if(item.id.substring(0,3) == filter){
			return true;
		}
	});
	filteredMapData.splice(0,1);

	var select = document.getElementById('secondary-map-selector');
	while (select.firstChild) {
	    select.removeChild(select.firstChild);
	}
	if(filteredMapData){
		var selectOptions = "";
		filteredMapData.forEach(function(map) {
			selectOptions += '<option value="'+map.id+'">'+map.name+'</option>';
		});
		$('#secondary-map-selector').append(selectOptions);
	}

	var currentMap = getHashParams().mapurl;
	$('#primary-map-selector option[value="'+currentMap.substring(0,3)+'"]').prop('selected', true);
	$('#secondary-map-selector option[value="'+currentMap+'"]').prop('selected', true);
}

var selectedVal = "";
var selected = $("input[type='radio'][name='s_2_1_6_0']:checked");
if (selected.length > 0) {
    selectedVal = selected.val();
}

function mapLoader(options, jsonData) {
	var mapWrapper = document.getElementById('map-component-wrapper');
	var map = document.createElement('map');
	var mapRequested = getHashParams().mapurl;
	var mapData = findObjById(jsonData.maps, mapRequested);
	var areaItems = "";
	
	mapData = mapData.map;

	if($('#map-area')){
		$('#map-area').remove();
	}

	mapImgHandle.setAttribute('src', 'img/maps/empty/'+options.mapurl+'.jpg');
	mapImgHandle.setAttribute('usemap', '#map-link-'+options.mapurl);
	mapWrapper.appendChild(mapImgHandle);

	if(mapData.linksToOtherMaps){
		$('area[rel="map"]').off('click');

		map.setAttribute('id', 'map-area');
		map.setAttribute('name', 'map-link-'+options.mapurl);
		mapWrapper.appendChild(map);

		mapData.linksToOtherMaps.forEach(function(area) {
			areaItems += '<area shape="'+area.shape+'" rel="'+area.rel+'" coords="'+area.coords+'" data-href="'+area.href+'" href="">';
		});
		$('#map-area').append(areaItems);

		$('area[rel="map"]').on('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			var params = getHashParams();
			var hash = '#';
			params.mapurl = this.getAttribute('data-href');
			$.each(params, function(key, value) {
				hash = hash+key+'='+value+'&';
			});

			hash = hash.substring(0, hash.length-1);
			window.location.hash = hash;

			return false;
		});
	}

	if($('.quartz')){
		$('.quartz').remove();
	}
	if (options.quartz == 1 && mapData.quartz){
		var quartzIcon = "";
		mapData.quartz.coords.forEach(function(quartz) {
			quartzIcon += '<img class="map-icon quartz" src="img/icons/quartz.png" style="width: 16px; height: 16px; position: absolute; top: '+quartz.top+'px; left: '+quartz.left+'px; z-index: 1;" title="Quartz">';
		});
		$('#map-component-wrapper').append(quartzIcon);
	}

	if($('.wells')){
		$('.wells').remove();
	}
	if (options.wells == 1 && mapData.wells){
		var wellIcon = "";
		mapData.wells.coords.forEach(function(well) {
			wellIcon += '<img class="map-icon wells" src="img/icons/well.png" style="width: 16px; height: 16px; position: absolute; top: '+well.top+'px; left: '+well.left+'px; z-index: 1;" title="well">';
		});
		$('#map-component-wrapper').append(wellIcon);
	}
}

function getHashParams() {
    var hashParams = {};
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);

    while (e = r.exec(q)){
       hashParams[d(e[1])] = d(e[2]);
    }
    if(hashParams.mapurl === undefined){
    	hashParams.mapurl = '1';
    	window.location.hash = '#mapurl=1';
    	return hashParams;
    }else{
    	return hashParams;
    }
}

function mouseWheelHandler(e) {
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

	if(delta < 0){
		if (mapImgHandle.src != window.location.origin+baseUrl+'/img/maps/empty/1.jpg'){
			var params = getHashParams();
			var hash = '#';
			params.mapurl = params.mapurl.substring(0, params.mapurl.length-2);
			$.each(params, function(key, value) {
				hash = hash+key+'='+value+'&';
			});
			window.location.hash =  hash.substring(0, hash.length-1);
		}
	}

	return false;
}

function loaded() {
	$("#loading").fadeOut(500);
	$("#map-overlay").fadeOut(500);
    lynAnim.stop();
}

function updateProgress() {
    loadedSoFar++;

    var newWidth = $("#progress").width() * (loadedSoFar / arrOfImg.length);
    var newPosition = newWidth - 125;

	$("#bar").css({'width': newWidth});

    $('#lyn-anim').css({
    	'-webkit-transform':'translate('+newPosition+'px)',
		'-ms-transform':'translate('+newPosition+'px)',
		'transform':'translate('+newPosition+'px)'
	});

	if(loadedSoFar === arrOfImg.length){
		setTimeout(function(){
			loaded();
		},1000);
	}

}

});
