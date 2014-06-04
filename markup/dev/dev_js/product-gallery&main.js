ui.productGalery = function () {
	if (!("Sly" in window)) return;

	var productGallery = $('.product-gallery');
	productGallery.each(function(){
		var $this = $(this),
			$holder = $('.product-gallery-holder',this),
			$elems = $('.product-list__item',this),
			$list = $('.product-list',this),
			$prev = $('<a class="product-gallery__prev">prev</a>'),
			$next = $('<a class="product-gallery__next">next</a>'),
			sly,
			prevMoving = false,
			nextMoving = false;

		$elems.each(function(){
			$(this).width($(this).width());
		});
		$list.width(listWidth($elems,totalWidth($elems)));
		$prev.add($next).appendTo(this);

		sly = (new Sly($holder,{
			horizontal: 1,
			speed: 300,
			forward: $next,
			backward: $prev,
			moveBy: $holder.width()
		}).init());

		$(window).resize(function () {
			$list.add($elems).css('width','auto');
			$elems.each(function(){
				$(this).width($(this).width());
			});
			$list.width(listWidth($elems,totalWidth($elems)));
			sly.reload();
		});
		$this.on('mousemove', function(e){
			if (e.pageX <= $this.offset().left + $this.width() * 0.15) {
				if (!prevMoving) {
					prevMoving = true;
					$prev.trigger('mousedown');
				}
			} else {
				if (prevMoving) {
					prevMoving = false;
					$prev.trigger('mouseup');
				}
			}
			if (e.pageX >= $this.offset().left + $this.width() * 0.85) {
				if (!nextMoving) {
					nextMoving = true;
					$next.trigger('mousedown');
				}
			} else {
				if (nextMoving) {
					nextMoving = false;
					$next.trigger('mouseup');
				}
			}
		}).on('mouseleave', function(){
			$prev.trigger('mouseup');
			$next.trigger('mouseup');
			prevMoving = false;
			nextMoving = false;
		});
	});
	function totalWidth(elems){
		var w = 0;
		elems.each(function(){
			w+=$(this).width();
		});
		return w;
	}
	function listWidth(elems, totalWidth){
		var halfWidth = totalWidth/2,
			w = 0,
			i = 0;
		while(w<halfWidth){
			w+=elems.eq(i).width();
			i++;
		}
		return w;
	}
}
ui.initElems.push("productGalery");