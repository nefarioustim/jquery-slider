(function($) {

    var debugMode = true,
        debug = function(msg) {
            if (!debugMode) { return; }
            if (window.console && window.console.log){
                window.console.log(msg);
            } else {
                alert(msg);
            }
        },
        defaults = {},
        methods = {
            confinePositionToLimit: function(x, limit) {
                return ~~(
                    Math.min(limit.right, Math.max(limit.left, x)) - limit.left
                ); // ~~ uses bitwise conversion as fast parseInt
            },
            init: function(options) {
                defaults = $.extend({
                    'max': 100,
                    'value': 0
                }, options);

                this.each(function(){
                    var $sliderValue = $(this),
                        $slider = $('<div class="slider" />'),
                        $sliderControl = $('<div class="slider-container"><div class="slider-handle"><span>Slide</span></div><div class="slider-strip"><div class="slider-fill"></div></div></div>'),
                        $sliderHandle = $('.slider-handle', $sliderControl),
                        $sliderFill = $('.slider-fill', $sliderControl),
                        calculatedWidth,
                        setValue = function(x) {
                            // Use of Math.min/max here to clip a variable
                            // See the "Clipping a variable" example here:
                            // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math/min
                            var y = Math.min(Math.max(x, 0), defaults.max),
                                position = ~~(
                                    (y / defaults.max) * calculatedWidth
                                ); // ~~ uses bitwise conversion as fast parseInt

                            setPosition(position, ~~x !== y); // ~~ uses bitwise conversion as fast parseInt
                        },
                        setPosition = function(x, setVal) {
                            if (setVal === undefined) setVal = true; // Avoid falsey-fail

                            $sliderHandle.css({
                                left: x
                            });
                            $sliderFill.css({
                                width: x
                            });

                            if (setVal) {
                                $sliderValue.val(
                                    ~~(
                                        (x / calculatedWidth) * defaults.max
                                    )
                                ); // ~~ uses bitwise conversion as fast parseInt
                            }
                        },
                        positionInLimit = function(x, limit) {
                            setPosition(
                                methods.confinePositionToLimit(x, limit)
                            );
                        },
                        addDragLimit = function(dd) {
                            dd.limit = $sliderControl.offset();
                            dd.limit.left = ~~dd.limit.left; // ~~ uses bitwise conversion as fast parseInt
                            dd.limit.right = dd.limit.left + calculatedWidth;
                            return dd;
                        };

                    $sliderValue
                        //.prop('type', 'hidden');
                        .after($sliderControl)
                        .add($sliderControl)
                        .wrapAll($slider);

                    $sliderFill.css({
                        height: '100%',
                        width: 0
                    });

                    calculatedWidth = $sliderControl.outerWidth() - $sliderHandle.outerWidth();

                    // $sliderHandle.bind('click mousedown mousemove mouseup', function(e) {
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    // });

                    $sliderHandle
                        .drag('start', function(e, dd) {
                            dd = addDragLimit(dd);
                        })
                        .drag(function(e, dd) {
                            positionInLimit(dd.offsetX, dd.limit);
                        });

                    // $sliderControl.bind('click mousedown mousemove mouseup', function(e) {
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    // });

                    $sliderControl
                        .mousedown(function(e) {
                            setPosition(e.offsetX);
                        })
                        .drag('start', function(e, dd) {
                            dd = addDragLimit(dd);
                            dd.handle = $sliderHandle.offset();
                        })
                        .drag(function(e, dd) {
                            positionInLimit(dd.handle.left + dd.deltaX, dd.limit);
                        });

                    $sliderValue.blur(function(e) {
                        setValue($sliderValue.val());
                    });

                    $sliderValue.val(defaults.value);
                    setValue($sliderValue.val());
                });

                return this;
            }
        };

    $.fn.slider = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.slider');
        }
    };

})(jQuery);
