(function() {
    // Declare some variables for reuse with test modules
    var $slider,
        sliderClass = '.video-seek';

    module('Integration: Test created widget success states', {
        setup: function() {
            // Setup default slider for the following tests
            $slider = $(sliderClass).slider();
        }
    });
    test('Validate markup', function() {
        // Check all the markup is in the right place
        deepEqual($(".slider").length, 1,
            "Slider wrapper exists.");
        deepEqual($(".slider-container").length, 1,
            "Slider container exists.");
        deepEqual($(sliderClass + " + .slider-container").length, 1,
            "Slider container is directly after the original text box.");
        deepEqual($(".slider-handle").length, 1,
            "Slider handle exists.");
        deepEqual($(".slider-strip").length, 1,
            "Slider strip exists.");
        deepEqual($(".slider-fill").length, 1,
            "Slider fill exists.");
        deepEqual($(".slider-strip .slider-fill").length, 1,
            "Slider fill is within the slider strip.");
    });
    test('Drag slider handle', function() {
        var dd, expectedHandleLeft, sliderHandleLeft,
            evDragStart = $.Event('dragstart'),
            evDrag = $.Event('drag'),
            $sliderHandle = $(".slider-handle"),
            testValues = [25, 500, -123, 4, 300, -500];

        $.each(testValues, function(i, val) {
            evDrag.offsetX = val;
            evDrag.offsetY = 5;
            dd = {
                offsetX: evDrag.offsetX,
                offsetY: evDrag.offsetY
            };

            $sliderHandle.trigger(evDragStart, dd);
            $sliderHandle.trigger(evDrag, dd);

            sliderHandleLeft = parseInt($sliderHandle.css('left'), 10);
            expectedHandleLeft = $slider.slider('confinePositionToLimit', val, dd.limit);

            deepEqual(sliderHandleLeft, expectedHandleLeft,
                "Slider handle in correct position when dragged " + val + "px"
            );
        });
    });
    test('Click slider strip', function() {
        var sliderHandleLeft, sliderFillWidth,
            ev = $.Event('mousedown'),
            $sliderHandle = $(".slider-handle"),
            $sliderFill = $(".slider-fill"),
            testValues = [370, 23, 500, 152, 290, 874];

        $.each(testValues, function(i, val){
            ev.offsetX = val;
            ev.offsetY = 5;

            $(".slider-strip").trigger(ev);

            sliderHandleLeft = parseInt($sliderHandle.css('left'), 10);
            sliderFillWidth = parseInt($sliderFill.css('width'), 10);

            deepEqual(sliderHandleLeft, val,
                "Slider handle in correct position when clicked at " + val);
            deepEqual(sliderFillWidth, val,
                "Slider fill is correct width when clicked at " + val);
        });
    });
})();