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