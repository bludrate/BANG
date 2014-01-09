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