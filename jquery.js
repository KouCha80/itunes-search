(function($){
$.fn.easyPaginate = function (options) {
    var defaults = {
        paginateElement: 'li',
        hashPage: 'page',
        elementsPerPage: 10,
        effect: 'default',
        slideOffset: 200,
        firstButton: true,
        firstButtonText: '<',
        lastButton: true,
        lastButtonText: '>',
        prevButton: true,
        prevButtonText: '<',
        nextButton: true,
        nextButtonText: '>'
    }

    return this.each (function (instance) {

        var plugin = Object;
        plugin.el = $(this);
        plugin.el.addClass('paginateList');

        plugin.settings = {
            pages: 0,
            objElements: Object,
            currentPage: 1
        }

        var getPages = function() {
            return Math.ceil(plugin.settings.objElements.length / plugin.settings.elementsPerPage);
        };
        var displayPage = function(page, forceEffect) {
            if(plugin.settings.currentPage != page) {
                plugin.settings.currentPage = parseInt(page);
                offsetStart = (page - 1) * plugin.settings.elementsPerPage;
                offsetEnd = page * plugin.settings.elementsPerPage;
                if(typeof(forceEffect) != 'undefined') {
                    eval("transition_"+forceEffect+"("+offsetStart+", "+offsetEnd+")");
                }else {
                    eval("transition_"+plugin.settings.effect+"("+offsetStart+", "+offsetEnd+")");
                }

                plugin.nav.find('.current').removeClass('current');
                plugin.nav.find('a.page:eq('+(page - 1)+')').addClass('current');

                switch(plugin.settings.currentPage) {
                    case 1:
                        $('.paginateNav a', plugin).removeClass('disabled');
                        $('.paginateNav a.first, .paginateNav a.prev', plugin).addClass('disabled');
                        break;
                    case plugin.settings.pages:
                        $('.paginateNav a', plugin).removeClass('disabled');
                        $('.paginateNav a.last, .paginateNav a.next', plugin).addClass('disabled');
                        break;
                    default:
                        $('.paginateNav a', plugin).removeClass('disabled');
                        break;
                }
            }
        };

        var displayNav = function() {
            htmlNav = '<div class="paginateNav">';

            if(plugin.settings.firstButton) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':1" title="First page" rel="1" class="first">'+plugin.settings.firstButtonText+'</a>';
            }

            if(plugin.settings.prevButton) {
                htmlNav += '<a href="" title="Previous" rel="" class="prev">'+plugin.settings.prevButtonText+'</a>';
            }

            for(i = 1;i <= plugin.settings.pages;i++) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':'+i+'" title="Page '+i+'" rel="'+i+'" class="page">'+i+'</a>';
            };

            if(plugin.settings.nextButton) {
                htmlNav += '<a href="" title="Next" rel="" class="next">'+plugin.settings.nextButtonText+'</a>';
            }

            if(plugin.settings.lastButton) {
                htmlNav += '<a href="#'+plugin.settings.hashPage+':'+plugin.settings.pages+'" title="Last page" rel="'+plugin.settings.pages+'" class="last">'+plugin.settings.lastButtonText+'</a>';
            }

            htmlNav += '</div>';
            plugin.nav = $(htmlNav);
            plugin.nav.css({
                'width': plugin.el.width()
            });
            plugin.el.after(plugin.nav);

            $('.paginateNav a.page, .paginateNav a.first, .paginateNav a.last', plugin).on('click', function(e) {
                e.preventDefault();
                displayPage($(this).attr('rel'));
            });

            $('.paginateNav a.prev', plugin).on('click', function(e) {
                e.preventDefault();
                page = plugin.settings.currentPage > 1?parseInt(plugin.settings.currentPage) - 1:1;
                displayPage(page);
            });

            $('.paginateNav a.next', plugin).on('click', function(e) {
                e.preventDefault();
                page = plugin.settings.currentPage < plugin.settings.pages?parseInt(plugin.settings.currentPage) + 1:plugin.settings.pages;
                displayPage(page);
            });
        };

        

        var transition_default = function(offsetStart, offsetEnd) {
            plugin.currentElements.hide();
            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.show();
        };

        var transition_fade = function(offsetStart, offsetEnd) {
            plugin.currentElements.fadeOut();
            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.fadeIn();
        };

        var transition_slide = function(offsetStart, offsetEnd) {
            plugin.currentElements.animate({
                'margin-left': plugin.settings.slideOffset * -1,
                'opacity': 0
            }, function() {
                $(this).remove();
            });

            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.currentElements.css({
                'margin-left': plugin.settings.slideOffset,
                'display': 'block',
                'opacity': 0,
                'min-width': plugin.el.width() / 2
            });
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.animate({
                'margin-left': 0,
                'opacity': 1
            });
        };

        var transition_climb = function(offsetStart, offsetEnd) {
            plugin.currentElements.each(function(i) {
                var $objThis = $(this);
                setTimeout(function() {
                    $objThis.animate({
                        'margin-left': plugin.settings.slideOffset * -1,
                        'opacity': 0
                    }, function() {
                        $(this).remove();
                    });
                }, i * 200);
            });

            plugin.currentElements = plugin.settings.objElements.slice(offsetStart, offsetEnd).clone();
            plugin.currentElements.css({
                'margin-left': plugin.settings.slideOffset,
                'display': 'block',
                'opacity': 0,
                'min-width': plugin.el.width() / 2
            });
            plugin.el.html(plugin.currentElements);
            plugin.currentElements.each(function(i) {
                var $objThis = $(this);
                setTimeout(function() {
                    $objThis.animate({
                        'margin-left': 0,
                        'opacity': 1
                    });
                }, i * 200);
            });
        };

        plugin.settings = $.extend({}, defaults, options);

        plugin.currentElements = $([]);
        plugin.settings.objElements = plugin.el.find(plugin.settings.paginateElement);
        plugin.settings.pages = getPages();
        if(plugin.settings.pages > 1) {
            plugin.el.html();

            // pagination starts
            displayNav();

            page = 1;
            if(document.location.hash.indexOf('#'+plugin.settings.hashPage+':') != -1) {
                page = parseInt(document.location.hash.replace('#'+plugin.settings.hashPage+':', ''));
                if(page.length <= 0 || page < 1 || page > plugin.settings.pages) {
                    page = 1;
                }
            }

            displayPage(page, 'default');
        }
    });
};
})(jQuery);
