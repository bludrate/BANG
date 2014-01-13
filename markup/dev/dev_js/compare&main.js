ui.compare = function () {
	var productList = $('.compare-list td:first-child'),
		titles = $('.compare__titles');
		titleList = $('td',titles),
		compare = $('.compare'),
		frame = $('.compare__frame'),
		list = $('.compare-list'),
		prev = compare.find('.compare__prev'),
		next = compare.find('.compare__next');
	if (compare.size()){
		$(window).load(function () {
			productList.each(function (i) {
				titleList.eq(i).height(productList.eq(i).height());
			});
			titles.addClass('ready');
		});

		if ("Sly" in window){
			var sly = (new Sly(frame,{
				horizontal: 1,
				speed: 300,
				touchDragging: 1
			},{
				'load':function () {
					if (list.width()>frame.width()){
						prev.add(next).show();
					} else {
						prev.add(next).hide();
					}
				}
			}).init());
			$(window).resize(function () {
				sly.reload();
			});
			prev.click(function (e) {
				sly.slideBy(-253);
				e.preventDefault();
			});
			next.click(function (e) {
				sly.slideBy(253);
				e.preventDefault();
			});
		}
	}
	$(document).on('click','.compare-list__remove-btn',function  (e) {
		var index = $(this).closest('td').index()+1;
		list.find('td:nth-child('+index+')').remove();
		sly.reload();
		e.preventDefault();
	});
}
ui.initElems.push("compare");