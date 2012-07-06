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
            getLimitObject: function($container, $handle) {
                return {
                    left: 0,
                    right: $container.outerWidth() - $handle.outerWidth()
                };
            },
            confinePositionToLimit: function(x, limit) {
                return Math.min(limit.right, Math.max(limit.left, x));
            },
            setValue: function(value) {

            },
            setPosition: function(position, setVal) {

            },
            init: function(options) {
                defaults = $.extend({
                    'max': 100,
                    'value': 0,
                    'hideInput': false
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
                        };

                    $sliderValue
                        .after($sliderControl)
                        .add($sliderControl)
                        .wrapAll($slider);

                    if (defaults.hideInput) $sliderValue.prop('type', 'hidden');

                    $sliderFill.css({
                        height: '100%',
                        width: 0
                    });

                    calculatedWidth = $sliderControl.outerWidth() - $sliderHandle.outerWidth();

                    $sliderHandle
                        .on('dragstart', function(e, dd) {
                            dd.limit = methods.getLimitObject($sliderControl, $sliderHandle);
                        })
                        .on('drag', function(e, dd) {
                            setPosition(
                                methods.confinePositionToLimit(
                                    dd.offsetX - $sliderControl.offset().left,
                                    dd.limit
                                )
                            );
                        });

                    $sliderControl
                        .on('mousedown', function(e) {
                            setPosition(e.offsetX);
                        })
                        .on('dragstart', function(e, dd) {
                            dd.limit = methods.getLimitObject($sliderControl, $sliderHandle);
                            dd.handle = $sliderHandle.offset();
                        })
                        .on('drag', function(e, dd) {
                            setPosition(
                                methods.confinePositionToLimit(
                                    dd.handle.left + dd.deltaX - $sliderControl.offset().left,
                                    dd.limit
                                )
                            );
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
