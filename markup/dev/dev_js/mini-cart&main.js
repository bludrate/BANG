ui.miniCart = function () {
	var miniCart = $('.mini-cart');
	miniCart.on("click",'.mini-cart__opener', function () {
		miniCart.toggleClass('mini-cart_active');
	});
	miniCart.on('click','.mini-cart__delete', function (e) {
		$(this).closest('.mini-cart__list-item').remove();
		e.preventDefault();
	});
	$(document).on('click',function (e) {
		if (!$(e.target).closest('.mini-cart').size() && !$(e.target).is('.mini-cart__delete')){
			miniCart.removeClass('mini-cart_active');
		}
	});
}
ui.initElems.push("miniCart");