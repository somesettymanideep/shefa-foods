var shopifySelector = '#shopify-section-';
$(document).on('shopify:inspector:activate', function(event){
    $(".grid-slider").not('.exception').each(function() {
        $(this).gridSlider();
    });
});
$(document).on('shopify:section:load shopify:section:unload', function(event){
    var sectionId       = event.detail.sectionId,
        $shopifySection = $(shopifySelector + sectionId);
    $shopifySection.find(".grid-slider").not('.exception').each(function() {
      $(this).gridSlider();
    });
    $('.cp_cd_js').removeClass('d-none');
    Alothemes.Megamenu.accordion();
    aloShopify.init();
});

$(document).on('shopify:section:select', function(event) {
  var sectionId       = event.detail.sectionId,
      $shopifySection = $(shopifySelector + sectionId);
  if ($shopifySection.hasClass('sc-menu-mobile')) {
      $('body').addClass('open_show open_menu');
        $('.box-menu-moible .ml_categories').removeClass('active');
        $('.box-menu-moible #mobile_categories').removeClass('active');
        $('.box-menu-moible .ml_menu').addClass('active');
        $('.box-menu-moible #mobile_menu').addClass('active');
    
  }else if($shopifySection.hasClass('sc-categories-mobile')){
      $('body').addClass('open_show open_menu');
      $('.box-menu-moible .ml_menu').removeClass('active');
      $('.box-menu-moible #mobile_menu').removeClass('active');
      $('.box-menu-moible .ml_categories').addClass('active');
      $('.box-menu-moible #mobile_categories').addClass('active');
  }else if ( $shopifySection.hasClass('type_promotion_popup') ) {
      aloShopify.PromotionPopup(true);
  }
});

$(document).on('shopify:section:deselect', function(event) {
  var sectionId  = event.detail.sectionId,
      $shopifySection = $(shopifySelector + sectionId);
  if ($shopifySection.hasClass('sc-menu-mobile') || $shopifySection.hasClass('sc-categories-mobile')  ) {
      $('body').removeClass('open_show open_menu');
  }
});

$(document).on('shopify:block:select', function(event){
  var sectionId = event.detail.sectionId,
      blockId   = event.detail.blockId,
      $shopifySection = $(shopifySelector + sectionId);

  if ($shopifySection.hasClass('slideshow')) {
      if ($('#laber_' + blockId).length) {
          var slideIndex = $('#laber_' + blockId).closest(".wrap_slide").attr("data-slick-index");
      } else {
          var slideIndex = $('#b_' + blockId).closest('.js_image_slide').attr("data-slick-index");
      }
      $shopifySection.find('.js_carousel').slick("slickGoTo", parseInt(slideIndex));
  }
  if (sectionId == "vertical_menu" ) {
    $('.lazy_vertical_menu').html($('#html_vertical_menu').html());
    $('.vertical_menu').addClass('open_sub');
    
    if ($shopifySection.hasClass('sp_header_mid')) {
        var bkjs = $('#bkjs_'+blockId);
        var li = bkjs.length ? $('.verticalmenu-item-has-children#item_' + bkjs.attr("data-id")) : $('.verticalmenu-item-has-children#item_' + blockId);
        $('.sp_header_mid .verticalmenu-item').removeClass('menu_item_hover');
        li.addClass('menu_item_hover');

        $('.lazy_menu_mega').one('lazyincluded', function(e) {
          
        });
    }
  }else if ($shopifySection.hasClass('header_megamenu')) {   
    var bkjs = $('#bkjs_'+blockId);
    var li = bkjs.length ? $('.has-children#item_' + bkjs.attr("data-id")) : $('.has-children#item_' + blockId);
    $('.header_megamenu .menu-item').removeClass('menu_item_hover');
    li.addClass('menu_item_hover');

    $('.lazy_menu_mega').one('lazyincluded', function(e) {

    });
  }
});

$(document).on('shopify:block:deselect', function(event){
  var sectionId = event.detail.sectionId, 
      blockId   = event.detail.blockId,
      $shopifySection = $(shopifySelector + sectionId);
  
  if (sectionId == "vertical_menu" ) {
    $('.lazy_vertical_menu').html($('#html_vertical_menu').html());
    $('.vertical_menu').removeClass('open_sub');
    
    if ($shopifySection.hasClass('sp_header_mid')) {
      $('.sp_header_mid .verticalmenu-item').removeClass('menu_item_hover');
    }
  }else if ($shopifySection.hasClass('header_megamenu')) {
    $('.header_megamenu .menu-item').removeClass('menu_item_hover');
  }
});
