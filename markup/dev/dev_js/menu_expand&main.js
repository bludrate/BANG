ui.menuExpand = function () {
	$('.menu').on('click','.menu__expander', function () {
		$(this).closest('.menu__title').toggleClass('active');
	});	
};
ui.initElems.push("menuExpand");