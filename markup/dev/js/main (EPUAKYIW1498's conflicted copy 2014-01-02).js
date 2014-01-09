
ui.initShortMenu = function () {
	var shortMenu = $('#short-menu'),
		topDistance = 220,
		$body = $(document.body);
	if (shortMenu.size()) {
		$(window).scroll(function () {
			var $this = $(this);
			if ($this.scrollTop()>=topDistance) {
				$body.addClass('short-menu_active');
			} else {
				$body.removeClass('short-menu_active');
			}
		});
	}
}
ui.initElems.push("initShortMenu");
ui.visualFix = function () {
	//nav arrow
	$('#nav .nav__arrow').each(function () {
		var $this = $(this);
		$this.css({
			'margin-left': $this.parent().width()/2-$this.width()/2
		});
	});
}
ui.initElems.push("visualFix");