ui.slider = function () {
	var slider = $('.promo-slider');
	slider.each(function () {
		var list = $('.promo-slider__item',this),
			switchers = $('.promo-slider__switch-item'),
			progress = $('.promo-slider__progress').hide();
		switchers.on('click',function (e) {
			var $this = $(this);
			list.removeClass('promo-slider__item_active').eq($this.index()).addClass('promo-slider__item_active');
			switchers.removeClass('promo-slider__switch-item_active');
			$this.addClass('promo-slider__switch-item_active');
			e.preventDefault();
		});
	});
};
ui.initElems.push('slider');