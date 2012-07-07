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
            setPosition: function(position, setVal) {
                if (setVal === undefined) setVal = true; // Avoid falsey-fail

                this.each(function(){
                    var $slider = $(this).closest('.slider'),
                        $sliderValue = $('input', $slider),
                        $sliderContainer = $('.slider-container', $slider),
                        $sliderHandle = $('.slider-handle', $sliderContainer),
                        $sliderFill = $('.slider-fill', $sliderContainer);

                    $sliderHandle.css({
                        left: position
                    });
                    $sliderFill.css({
                        width: position
                    });

                    if (setVal) {
                        $sliderValue.val(
                            parseInt(
                                (position / ($sliderContainer.outerWidth() - $sliderHandle.outerWidth())) * defaults.max,
                                10
                            )
                        );
                    }
                });

                return this;
            },
            setValue: function(x) {
                this.each(function(){
                    var $slider = $(this).closest('.slider'),
                        $sliderValue = $('input', $slider),
                        $sliderContainer = $('.slider-container', $slider),
                        $sliderHandle = $('.slider-handle', $sliderContainer),
                        setVal,
                        // Use of Math.min/max here to clip a variable
                        // See the "Clipping a variable" example here:
                        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math/min
                        y = Math.min(Math.max(x, 0), defaults.max),
                        position = parseInt(
                            (y / defaults.max) * ($sliderContainer.outerWidth() - $sliderHandle.outerWidth()),
                            10
                        );
                        setVal = (parseInt(x, 10) !== y);

                    $sliderValue.val(x);
                    $slider.slider('setPosition', position, setVal);
                });

                return this;
            },
            init: function(options) {
                var $slider = $('<div class="slider" />'),
                    $sliderControl = $('<div class="slider-container"><div class="slider-handle"><span>Slide</span></div><div class="slider-strip"><div class="slider-fill"></div></div></div>'),
                    $sliderHandle = $('.slider-handle', $sliderControl),
                    $sliderFill = $('.slider-fill', $sliderControl);

                defaults = $.extend({
                    'max': 100,
                    'value': 0,
                    'hideInput': false,
                    'start': function(e){},
                    'slide': function(e){},
                    'stop': function(e){}
                }, options);

                this.each(function(){
                    var $sliderValue = $(this),
                        calculatedWidth;

                    $sliderValue
                        .after($sliderControl)
                        .add($sliderControl)
                        .wrapAll($slider);

                    $slider = $sliderValue.closest('.slider'); // Regrab slider reference for later method calls

                    if (defaults.hideInput) $sliderValue.prop('type', 'hidden');

                    $sliderFill.css({
                        height: '100%',
                        width: 0
                    });

                    calculatedWidth = $sliderControl.outerWidth() - $sliderHandle.outerWidth();

                    $sliderHandle
                        .on('dragstart', function(e, dd) {
                            $slider.trigger('start');
                            dd.limit = $slider.slider('getLimitObject', $sliderControl, $sliderHandle);
                        })
                        .on('drag', function(e, dd) {
                            $slider.trigger('slide');
                            $slider.slider('setPosition',
                                $slider.slider('confinePositionToLimit',
                                    dd.offsetX - $sliderControl.offset().left,
                                    dd.limit
                                )
                            );
                        })
                        .on('dragend', function(e, dd) {
                            $slider.trigger('stop');
                        });

                    $sliderControl
                        .on('mousedown', function(e) {
                            $slider.trigger('start');
                            $slider.slider('setPosition', e.offsetX);
                        })
                        .on('mouseup', function(e) {
                            $slider.trigger('stop');
                        })
                        .on('dragstart', function(e, dd) {
                            $slider.trigger('start');
                            dd.limit = $slider.slider('getLimitObject', $sliderControl, $sliderHandle);
                            dd.handle = $sliderHandle.offset();
                        })
                        .on('drag', function(e, dd) {
                            $slider.trigger('slide');
                            $slider.slider('setPosition',
                                $slider.slider('confinePositionToLimit',
                                    dd.handle.left + dd.deltaX - $sliderControl.offset().left,
                                    dd.limit
                                )
                            );
                        })
                        .on('dragend', function(e, dd) {
                            $slider.trigger('stop');
                        });

                    $sliderValue.val(defaults.value);
                    $slider.slider('setValue', $sliderValue.val());

                    $slider.on('start', defaults.start);
                    $slider.on('slide', defaults.slide);
                    $slider.on('stop', defaults.stop);
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
