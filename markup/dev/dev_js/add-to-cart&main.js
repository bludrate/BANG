(function () {
	$(function() {
		addToCart();
	})

	function addToCart() {
		var elem = $('<span class="add-to-cart-ico"><img src="img/add-to-cart.png"/></span>');
		$(document).on('click', '.addToCart-elem', function (e) {
			var $body = $(document.body),
				target = $body.hasClass('short-menu_active') ? $('#short-menu .addToCart-target') : $('.mini-cart .addToCart-target');

			if (!target.size()) return;

			$body.append(elem);

			elem.css({
				'top': elem.offset().top,
				'position': 'absolute'
			});

			elem.fadeTo(300,1, function() {
				elem.animate({
					'left': target.offset().left,
					'top': target.offset().top,
					'width': target.height(),
					'height': target.height(),
					'margin-left': 0
				},300, function() {
					elem.fadeTo(200, 0, function() {
						elem.remove().removeAttr('style');
					})
				});
			});

			e.preventDefault();
		});
	};
})();