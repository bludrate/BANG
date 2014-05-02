(function () {
	$(function() {
		addToCart();
	})

	function addToCart() {
		$(".add-comment__link").on('click', function (e) {
			$(this).closest('.add-comment').addClass('active').find('textarea').focus();
			e.preventDefault();
		});
	};
})();