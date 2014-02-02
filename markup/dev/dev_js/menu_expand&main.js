ui.menuExpand = function () {
	$('.menu').on('click','.menu__expander', function () {
		var $this = $(this),
			title = $this.closest('.menu__title'),
			menu = title.closest('.menu');
		if(title.hasClass('active')){
			title.removeClass('active');
		} else {
			menu.find('.menu__title').removeClass('active');
			title.addClass('active');
		}
	});	
};
ui.initElems.push("menuExpand");