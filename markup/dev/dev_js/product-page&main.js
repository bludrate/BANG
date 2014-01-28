ui.productPopupGallery = function () {
	var productGeneral = $('.product-general'),
		popupId = "product-visual-popup",
		galleryList,
		switchersList,
		popupGallery,
		popupGalleryList;
	if (productGeneral.size()){
		galleryList = productGeneral.find('.product-general__visual-item');
		switchersList = productGeneral.find('.product-general__switchers-item');
		popupGallery = $('.product-popup__gallery');
		popupGalleryList = popupGallery.find('.product-popup__gallery-item');
		switchersList.on('click',function (e) {
			var $this = $(this);
			if ($this.hasClass('active')){
				ui.popup.open(popupId);
				popupGalleryList.eq($this.index()).trigger('click');
			} else {
				switchersList.removeClass('active');
				$this.addClass('active');
				galleryList.removeClass('active').eq($this.index()).addClass('active');
			}
			e.preventDefault();
		})
		$(window).load(function(){
			var popupHolder = $('#'+popupId).show().parent().show();
			popupGallery.roundabout({
				"childSelector": ".product-popup__gallery-item",
				"minScale": 0.3
			});
			popupHolder.hide().find('#'+popupId).hide();
		});
	}
}
ui.initElems.push("productPopupGallery");