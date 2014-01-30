ui.miniCart = function () {
	var miniCart = $('.mini-cart');
	miniCart.on("click",'.mini-cart__opener', function (e) {
		miniCart.toggleClass('mini-cart_active');
		e.preventDefault();
	});
	$(document).on('click',function (e) {
		if (!$(e.target).closest('.mini-cart').size() && !$(e.target).is('.mini-cart__delete')){
			miniCart.removeClass('mini-cart_active');
		}
	});
	miniCart.each(function () {
		var $this = $(this),
			yourorder = $this.is('.your-order'),
			list = $('.mini-cart__list-item',this),
			costsPriceElem = $('.mini-cart__costs-total .mini-cart__costs-price',this), 
			totalPriceElem = $('.mini-cart__total-price',this),
			currency = $this.attr('data-currency'),
			totalPrice,
			deliveryPrice;
		$(this).on('click','.mini-cart__delete',function (e) {
			$(this).closest('.mini-cart__list-item').remove();
			totalPrice = 0;
			list = $this.find('.mini-cart__list-item').each(function () {
				var elem = $(this);
				totalPrice += Number(elem.find('.mini-cart__price').text().replace(/[^0-9]/g,"")) * Number(elem.find('.count-input input').val());
			});
			if (yourorder){
				costsPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
				deliveryPrice = Number($this.find('.mini-cart__delivery-price').text().replace(/[^0-9]/g,""));
				deliveryPrice = deliveryPrice ? deliveryPrice : 0;
				totalPriceElem.text((totalPrice+deliveryPrice).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			} else {
				totalPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			}
			e.preventDefault();
		}).find('.count-input input').on('change.count',function (e) {
			totalPrice = 0;
			list.each(function () {
				var elem = $(this);
				totalPrice += Number(elem.find('.mini-cart__price').text().replace(/[^0-9]/g,"")) * Number(elem.find('.count-input input').val());
			});
			if (yourorder){
				costsPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
				deliveryPrice = Number($this.find('.mini-cart__delivery-price').text().replace(/[^0-9]/g,""));
				deliveryPrice = deliveryPrice ? deliveryPrice : 0;
				totalPriceElem.text((totalPrice+deliveryPrice).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			} else {
				totalPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			}
		});
	});
}
ui.initElems.push("miniCart");