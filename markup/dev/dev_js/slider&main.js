ui.slider = function () {
	var slider = $('.promo-slider');
	slider.each(function () {
		var list = $('.promo-slider__item',this),
			switchers = $('.promo-slider__switch-item',this),
			progressElem = $('.promo-slider__progress',this),
			progressValElem = progressElem.children(),
			progressTimer,
			progress = 0,
			progressTimeUpdate = 30,
			autoslide = 7000,
			progressStep = progressTimeUpdate*100 / autoslide,
			hover = false;

		switchers.on('click',function (e) {
			changeSlide($(this));
			e.preventDefault();
		});
		function changeSlide(elem){
			var $this = isNaN(Number(elem)) ? elem : switchers.eq(elem),
				index = isNaN(Number(elem)) ? elem.index() : elem;

			list.removeClass('promo-slider__item_active').eq(index).addClass('promo-slider__item_active');
			switchers.removeClass('promo-slider__switch-item_active');
			$this.addClass('promo-slider__switch-item_active');
			progressElem.css({
				'left': $this.offset().left-$this.parent().offset().left
			});
			clearInterval(progressTimer);
			progress = 0;
			progressValElem.width(0);
			if (!hover)
				progressTimer = setInterval(progressUpdate,progressTimeUpdate);
		}
		function progressUpdate () {
			progress += progressStep;
			progressValElem.css({'width':progress+"%"});
			if (progress>100){
				var active = switchers.filter(".promo-slider__switch-item_active");
				if (active.next().size()){
					changeSlide(active.index()+1);
				} else {
					changeSlide(0);
				}
			}
		}
		$(this).hover(function () {
			hover = true;
			clearInterval(progressTimer);
		},function () {
			progressTimer = setInterval(progressUpdate,progressTimeUpdate);
			hover = false;
		});
		switchers.eq(0).trigger('click');
	});
};
ui.initElems.push('slider');