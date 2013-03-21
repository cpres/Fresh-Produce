var debug_el = $("#debug");
function debug(text) {
    debug_el.text(text);
}


/**
 * requestAnimationFrame and cancel polyfill
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


/**
 * super simple carousel
 * animation between panes happens with css transitions
 */
function Carousel(element)
{
    var self = this;
    element = $(element);

    var container = $(">ul", element);
    var panes = $(">ul>li", element);

    var pane_width = 0;
    var pane_count = panes.length;
    var zoom = 0;
    var tapped = 0;
    var _timeout;

    var current_pane = 0;


    /**
     * initial
     */
    this.init = function() {
        setPaneDimensions();

        $(window).on("load resize orientationchange", function() {
            setPaneDimensions();
            //updateOffset();
        })
    };


    /**
     * set the pane dimensions and scale the container
     */
    function setPaneDimensions() {
        pane_width = element.width();
        panes.each(function() {
            $(this).width(pane_width);
        });
        container.width(pane_width*pane_count);
    };


    /**
     * show pane by index
     * @param   {Number}    index
     */
    this.showPane = function( index ) {
        // between the bounds
        index = Math.max(0, Math.min(index, pane_count-1));
        current_pane = index;

        var offset = -((100/pane_count)*current_pane);
        setContainerOffset(offset, true);
    };

    this.showLarge = function ( index ) {
        index = Math.max(0, Math.min(index, pane_count-1)) +1;
        var large = $(".pane"+index+" span").attr('data-large');
        var small = $(".pane"+index+" img").attr('src');
        $(".pane"+index+" img").attr('src',large);
        $(".pane"+index+" span").attr('data-large',small);
        if (zoom) {
            zoom = 0;
        } else {
            zoom = 1;
        }
    }

    this.showClick = function (index) {
        index = Math.max(0, Math.min(index, pane_count-1)) +1;
        var click = $(".pane"+index+" span").attr('data-click');
        var clear = $(".pane"+index+" img").attr('src');
        $(".pane"+index+" img").attr('src',click);
        $(".pane"+index+" span").attr('data-click',clear);
        if (tapped) {
            tapped = 0;
        } else {
            tapped = 1;
        }
    }


    function setContainerOffset(percent, animate) {
        container.removeClass("animate");

        if(animate) {
            container.addClass("animate");
        }

        if(Modernizr.csstransforms3d) {
            container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
        }
        else if(Modernizr.csstransforms) {
            container.css("transform", "translate("+ percent +"%,0)");
        }
        else {
            var px = ((pane_width*pane_count) / 100) * percent;
            container.css("left", px+"px");
        }
    }

    this.next = function() { return this.showPane(current_pane+1, true); };
    this.prev = function() { return this.showPane(current_pane-1, true); };



    function handleHammer(ev) {
        // disable browser scrolling
        ev.gesture.preventDefault();

        switch(ev.type) {
            case 'dragright':
            case 'dragleft':
                // stick to the finger
                
                var pane_offset = -(100/pane_count)*current_pane;
                var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                // slow down at the first and last pane
                if((current_pane == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
                    (current_pane == pane_count-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
                    drag_offset *= .4;
                }
                ev.stopPropagation();

                setContainerOffset(drag_offset + pane_offset);
                break;

            /*case 'pinchin' :
                if (zoom)
                    self.showLarge(current_pane);
                break;

            case 'pinchout':
                self.showLarge(current_pane);
                break;*/

            case 'swipeleft':
                self.next();
                ev.gesture.stopDetect();
                break;

            case 'swiperight':
                self.prev();
                ev.gesture.stopDetect();
                break;

            /*case 'tap':
                if (!zoom)
                    self.showClick(current_pane);
                break;*/

            case 'release':
                // more then 50% moved, navigate
                if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                    if(ev.gesture.direction == 'right') {
                        self.prev();
                    } else {
                        self.next();
                    }
                }
                else {
                    self.showPane(current_pane, true);
                }
                break;
        }
    }

    element.hammer({ drag_lock_to_axis: true })
        .on("release dragleft dragright swipeleft swiperight doubletap pinchin pinchout tap", handleHammer);
}

var Products = [
    [
        {
            entity_id: "4380",
            name: "Moraley Flower Stackable Bands",
            meta_description: "Add style with delicate mixed metal flower stackable band rings from Stella & Dot. Find fashion rings, cocktail rings, vintage rings, bands & more.",
            image: "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/image/450x682/9df78eab33525d08d6e5fb8d27136e95/r/1/r146gs_moraley_flower_band_set.jpg",
            small_image: "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/small_image/88x77/9df78eab33525d08d6e5fb8d27136e95/r/1/r146gs_moraley_flower_band_set.jpg",
            thumbnail: "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/thumbnail/75x75/9df78eab33525d08d6e5fb8d27136e95/r/1/r146gs_moraley_flower_band_set.jpg",
            url_key: "moraley-flower-stackable-bands",
            url_path: "moraley-flower-stackable-bands.html",
            price: "$39"
        },
        {
            entity_id:  "4378",
            name:  "Mary-Margaret Stone Ring",
            meta_title:  "Turquoise Stone & Gold Cocktail Ring | Mary-Margaret Ring",
            meta_description:  "Look stylish & on trend with a turquoise stone & gold cocktail ring from Stella & Dot. Find fashion rings, cocktail rings, vintage rings, bands & more.",
            image:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/image/450x682/9df78eab33525d08d6e5fb8d27136e95/r/1/r1425tu_mary-margaret_angled.jpg",
            small_image:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/small_image/88x77/9df78eab33525d08d6e5fb8d27136e95/r/1/r1425tu_mary-margaret_angled.jpg",
            thumbnail:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/thumbnail/75x75/9df78eab33525d08d6e5fb8d27136e95/r/1/r1425tu_mary-margaret_angled.jpg",
            url_key:  "mary-margaret-stone-ring",
            url_path:  "mary-margaret-stone-ring.html",
            price:  "$39"

        }
    ],
    [
        {
            entity_id:  "608",
            name:  "Camilla Ring ",
            meta_title:  "Large Green Stone & Gold Cocktail Ring | Camilla Ring",
            meta_description:  "Shop for an aventurine stone cocktail ring in an antique gold setting from Stella & Dot. Find fashion rings, cocktail rings, vintage rings, bands & more.",
            image:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/image/450x682/9df78eab33525d08d6e5fb8d27136e95/r/1/r113_1.jpg",
            small_image:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/small_image/88x77/9df78eab33525d08d6e5fb8d27136e95/r/1/r113_1.jpg",
            thumbnail:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/thumbnail/75x75/9df78eab33525d08d6e5fb8d27136e95/r/1/r113_1.jpg",
            url_key:  "camilla-ring",
            url_path:  "camilla-ring.html",
            price:  "$49"
        },
        {
            entity_id:  "2321",
            name:  "Soiree Trio Ring",
            meta_title:  "Black Diamond, Glass & Crystal Cocktail Ring | Soiree Trio Ring",
            meta_description:  "Stand out with a striking triple dome ring with mixed crystal pave balls by Stella & Dot. Find handbags, cross body bags, clutches, wristlets, pouches & more.",
            image:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/image/450x682/9df78eab33525d08d6e5fb8d27136e95/r/1/r115h_1.jpg",
            small_image:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/small_image/88x77/9df78eab33525d08d6e5fb8d27136e95/r/1/r115h_1.jpg",
            thumbnail:  "http://shop.dev02.stelladotdev.com/style/media/catalog/product/cache/0/thumbnail/75x75/9df78eab33525d08d6e5fb8d27136e95/r/1/r115h_1.jpg",
            url_key:  "r115h",
            url_path:  "r115h.html",
            price:  "$49"
        }
    ]
];


$(function() {
    // Init Products
    var $carousel = $("#carousel"),
        $productPaneTemplate = $("#product-pane-template").remove().attr("id", ""),
        $productTemplate = $productPaneTemplate.children("div").remove().clone(),
        $panes = $();

    $.each(Products, function(i, products) {
        var $productPane = $productPaneTemplate.clone();
        $.each(products, function(i, product) {
            var $product = $productTemplate.clone();
            $product.attr("data-product-id", product.entity_id);
            $product.find(".product-image").attr("src", product.image);
            $product.find(".product-name").html(product.name);
            $product.find(".product-price").html(product.price);

            $product.appendTo($productPane);
        });

        $panes = $panes.add($productPane);
    });
    $carousel.children().children().eq(0).after($panes);


    // Init carousel
    var carousel = new Carousel("#carousel");
    carousel.init();

    // Product Events

    // hear count click
    $carousel.delegate(".heart-count", "click", function() {
        carousel.showPane($carousel.find("li").size());
    });

    // image click
    $carousel.delegate("img.product-image", "click", function() {
        $(this).closest(".product-section").toggleClass("display-details");
    });
    $carousel.hammer().on("pinchout", "img.product-image", function() {
        if ($("#zoom-image").size() == 0) {
            var $image = $('<div id="zoom-image"></div>');
            $image.css("background-image", 'url(' + $(this).attr("src") + ')');

            $image.appendTo("body");
            window.setTimeout(function() {
                $image.addClass("zoomed");
            }, 10);
        }
    });

    // image zoome out
    $("body").hammer().on("pinchin", "#zoom-image", function(event) {
        var $image = $(this).removeClass("zoomed");
        window.setTimeout(function() {
            $image.remove();
        }, 250);
    });

    // heart icon click
    $carousel.delegate("span.heartit", "click", function() {
        var $product = $(this).closest(".product-section");
        console.log("Hearted Product ID: " + $product.data("product-id"));

        // save product info
        // get heart count
        var count = parseInt($(".heart-count span").html());
        var heartCount = count+1; // hard coded temporarily for example

        // update heart count els
        $(".heart-count span:first-of-type").html(heartCount);
    });

    // image zoom out
});
/***** Organizer Section ******/
$(".drag")
    .hammer({ drag_max_touches:0})
    .on("touch drag", function(ev) {
        var touches = ev.gesture.touches;

        ev.stopPropagation();
        ev.gesture.preventDefault();

        for(var t=0,len=touches.length; t<len; t++) {
            var target = $(touches[t].target);
            target.css({
                zIndex: 1337,
                left: touches[t].pageX-50,
                top: touches[t].pageY-50
            });
        }
    })
    .on("dragend", function(ev) {
        var touches = ev.gesture.touches;
        var xWish = getOffset( document.getElementById('count-email') ).left; 
        var xScreen = parseInt(jQuery('#carousel').width()); 
        var screenCount = jQuery('.animate li').length - 1;

        var xForget = getOffset( document.getElementById('count-forget') ).left; 
        var xSlack = xScreen*screenCount;
        var yWish = getOffset( document.getElementById('count-email') ).top; 
        if ( touches[0].pageY > (yWish-50) ) {
            jQuery(this).fadeOut();    
            if((touches[0].pageX + xSlack) < xWish) {
                var count = parseInt(jQuery('#count-wishlist').html());
                jQuery('#count-wishlist').text(count +1);
            } else if((touches[0].pageX + xSlack) < xForget) {
                var count = parseInt(jQuery('#count-email').html());
                jQuery('#count-email').text(count +1);
            } else { 
                var count = parseInt(jQuery('#count-forget').html());
                jQuery('#count-forget').text(count +1);
            }
        }
    });

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}


