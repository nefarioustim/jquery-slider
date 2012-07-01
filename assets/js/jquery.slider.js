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
        methods = {
            init: function(options) {
                var defaults = $.extend({
                    'max': 100,
                    'value': 0
                }, options);

                this.each(function(){
                    var $sliderValue = $(this),
                        $slideControl = $('<div class="slide-container"><button type="button" class="slide-handle"><span>Slide</span></button><div class="slide-strip"><div class="slide-fill"></div></div></div>'),
                        $slideHandle = $('.slide-handle', $slideControl),
                        $slideFill = $('.slide-fill', $slideControl),
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

                            $slideHandle.css({
                                left: x
                            });
                            $slideFill.css({
                                width: x
                            });

                            if (setVal) {
                                $sliderValue.val(
                                    ~~(
                                        (
                                            x / calculatedWidth
                                        ) * defaults.max
                                    )
                                ); // ~~ uses bitwise conversion as fast parseInt
                            }
                        },
                        limitDrag = function(x, limit) {
                            x = ~~(
                                Math.min(
                                    limit.right,
                                    Math.max(
                                        limit.left,
                                        x
                                    )
                                ) - limit.left
                            ); // ~~ uses bitwise conversion as fast parseInt

                            setPosition(x);
                        };

                    $sliderValue.after($slideControl);
                    //$sliderValue.prop('type', 'hidden');

                    $slideFill.css({
                        height: '100%',
                        width: 0
                    });

                    calculatedWidth = $slideControl.outerWidth() - $slideHandle.outerWidth();

                    $slideHandle
                        .drag('start', function dragStart(e, dd) {
                            dd.limit = $slideControl.offset();
                            dd.limit.left = ~~dd.limit.left; // ~~ uses bitwise conversion as fast parseInt
                            dd.limit.right = dd.limit.left + calculatedWidth;
                        })
                        .drag(function(e, dd) {
                            limitDrag(dd.offsetX, dd.limit);
                        });

                    $slideControl
                        .drag('start', function dragStart(e, dd) {
                            dd.limit = $slideControl.offset();
                            dd.limit.left = ~~dd.limit.left; // ~~ uses bitwise conversion as fast parseInt
                            dd.limit.right = dd.limit.left + calculatedWidth;
                            dd.handle = $slideHandle.offset();
                        })
                        .drag(function(e, dd) {
                            limitDrag(dd.handle.left + dd.deltaX, dd.limit);
                        });

                    $slideControl.mousedown(function(e) {
                        setPosition(e.offsetX);
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
