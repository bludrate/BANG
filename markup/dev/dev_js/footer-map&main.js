ui.footerMap = function () {
	var timer,
		map = $('.footer-map');
	map.hover(function () {
		timer = setTimeout(function () {
			map.addClass('footer-map_active');
		}, 1000);
	}, function () {
		clearTimeout(timer);
		map.removeClass('footer-map_active');
	});
	map.on('click','.map-popup__close',function (e) {
		$(this).closest('.map-popup').hide();
		e.preventDefault();
	});
};
ui.initElems.push("footerMap");