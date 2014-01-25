ui.gallery = function () {
	var gallery = $('.gallery');
	gallery.each(function () {
		var list = $('.gallery__list',this),
			items = $('.gallery__item',list),
			frame = $('.gallery__frame',this),
			switchers = $('.gallery__switchers-item',this),
			width = 0;
		items.each(function  () {
			width += $(this).width();
		});
		list.css({
			'width':width,
			'left':list.offset().left - items.eq(0).offset().left + (frame.width()-items.eq(0).width())/2
		});
		switchers.on('click',function (e) {
			var $this = $(this);
			if (!$this.hasClass('gallery__switchers-item_active')){
				slideTo($this.index());
			}
			e.preventDefault();
		});
		items.on('click',function (e) {
			var $this = $(this);
			if (!$this.hasClass('gallery__item_active')){
				slideTo($this.index());
				e.preventDefault();
			}
		});
		function slideTo(index){
			switchers.removeClass('gallery__switchers-item_active').eq(index).addClass('gallery__switchers-item_active');
			items.removeClass('gallery__item_active').eq(index).addClass('gallery__item_active');
			list.css({
				'left':list.offset().left - items.eq(index).offset().left + (frame.width()-items.eq(index).width())/2
			});
		}
	});
};
ui.initElems.push("gallery");