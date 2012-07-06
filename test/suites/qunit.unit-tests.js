(function() {
    // Declare some variables for reuse with test modules
    var $slider,
        sliderClass = '.video-seek';

    module('Unit tests on exposed functions', {
        setup: function() {
            // Setup default slider for the following tests
            $slider = $(sliderClass).slider();
        }
    });
    test('getLimitObject success', function() {
        var $sliderContainer = $('.slider-container'),
            $sliderHandle = $('.slider-handle'),
            expectedLeft = 0,
            expectedRight = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            limit = $slider.slider('getLimitObject', $sliderContainer, $sliderHandle);

        deepEqual(
            limit.constructor,
            Object,
            "Returned an object"
        );
        ok(
            limit.hasOwnProperty('left') && limit.hasOwnProperty('right'),
            "Object has the correct properties"
        );
        deepEqual(
            limit.left,
            expectedLeft,
            "limit.left is "+expectedLeft+" as expected"
        );
        deepEqual(
            limit.right,
            expectedRight,
            "limit.right is "+expectedRight+" as expected"
        );
    });
    test('confinePositionToLimit success', function() {
        var $sliderContainer = $('.slider-container'),
            $sliderHandle = $('.slider-handle'),
            limit = $slider.slider('getLimitObject', $sliderContainer, $sliderHandle),
            values = [
                { value: limit.left, expected: limit.left },
                { value: limit.right, expected: limit.right },
                { value: limit.left - 25, expected: limit.left },
                { value: limit.right + 25, expected: limit.right },
                { value: ~~((limit.left + limit.right) / 2), expected: ~~((limit.left + limit.right) / 2) }
            ];

        $.each(values, function(i, val) {
            deepEqual(
                $slider.slider('confinePositionToLimit', val.value, limit),
                val.expected,
                "Returns " + val.expected + " when passed " + val.value
            );
        });
    });
    test('setPosition success without setting value', function() {
        var $sliderHandle = $('.slider-handle'),
            $sliderFill = $('.slider-fill'),
            val = 20;

        $slider.slider('setPosition', val);

        sliderFillWidth = parseInt($sliderFill.css('width'), 10);
        expectedFillWidth = 20;
        sliderHandleLeft = parseInt($sliderHandle.css('left'), 10);
        expectedHandleLeft = 20;

        deepEqual(sliderHandleLeft, expectedHandleLeft,
            "Slider handle in correct position when setPosition passed " + val
        );
        deepEqual(sliderFillWidth, expectedFillWidth,
            "Slider fill is correct width when setPosition passed " + val
        );
    });
})();