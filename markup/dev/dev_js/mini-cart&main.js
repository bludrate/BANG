ui.miniCart = function () {
	var miniCart = $('.mini-cart');
	miniCart.on("click",'.mini-cart__opener', function () {
		miniCart.toggleClass('mini-cart_active');
	});
	miniCart.on('click','.mini-cart__delete', function () {
		$(this).closest('.mini-cart__list-item').remove();
	});
	$(document).on('click',function (e) {
		if (!$(e.target).closest('.mini-cart').size()){
			miniCart.removeClass('mini-cart_active');
		}
	});
}
ui.initElems.push("miniCart");