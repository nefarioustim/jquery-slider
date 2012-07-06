(function() {
    // Declare some variables for reuse with test modules
    var $slider,
        sliderClass = '.video-seek';

    module('Unit: Success states', {
        setup: function() {
            // Setup default slider for the following tests
            $slider = $(sliderClass).slider();
        }
    });
    test('getLimitObject', function() {
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
    // test('setPosition', function() {
    //     var $sliderHandle = $('.slider-handle'),
    //         $sliderFill = $('.slider-fill'),
    //         val = 20;

    //     $slider.slider('setPosition', val);

    //     sliderFillWidth = parseInt($sliderFill.css('width'), 10);
    //     expectedFillWidth = position;
    //     sliderHandleLeft = parseInt($sliderHandle.css('left'), 10);
    //     expectedHandleLeft = position;

    //     deepEqual(sliderHandleLeft, expectedHandleLeft,
    //         "Slider handle in correct position when setPosition passed " + val
    //     );
    //     deepEqual(sliderFillWidth, expectedFillWidth,
    //         "Slider fill is correct width when setPosition passed " + val
    //     );
    // });
})();