ui.basket = function () {
	var basket = $('.basket');
	basket.each(function () {
		var table = $('.basket__table',this),
			totalPriceElem = $('.basket__total-price'),
			currency = $(this).attr('data-currency'),
			totalPrice;
		$('.basket__table',this).on('click','.delete-btn',function (e) {
			$(this).closest('tr').remove();
			totalPrice = 0;
			table.find('.basket__sum').each(function () {
				totalPrice += Number($(this).text().replace(/[^0-9]/g,""));
			});
			totalPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			e.preventDefault();
		}).find('.count-input input').on('change.count',function (e) {
			var tr = $(this).closest('tr'),
				price = (Number(tr.find('.basket__price').text().replace(/[^0-9]/g,""))*e.value).toString();
			totalPrice = 0;
			if (!isNaN(Number(price)))
				tr.find('.basket__sum').text(price.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
			totalPrice = 0;
			table.find('.basket__sum').each(function () {
				totalPrice += Number($(this).text().replace(/[^0-9]/g,""));
			});
			totalPriceElem.text(totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" "+currency+".");
		});
	});
	
}
ui.initElems.push("basket");