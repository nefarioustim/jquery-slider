(function() {
    // Declare some variables for reuse with test modules
    var $slider,
        sliderClass = '.video-seek';

    module('Functional: Test created widget success states', {
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
        var sliderHandleLeft, expectedHandleLeft,
            sliderFillWidth, expectedFillWidth,
            expectedValue,
            evDragStart = $.Event('dragstart'),
            evDrag = $.Event('drag'),
            evDragStop = $.Event('dragstop'),
            $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            $sliderFill = $(".slider-fill"),
            $sliderValue = $(".video-seek"),
            width = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            limit = $slider.slider('getLimitObject', $sliderContainer, $sliderHandle),
            testPositionPercentage = [0, 33, 50, 25, 75, 100, 99, 98, 97];

        $.each(testPositionPercentage, function(i, perc) {
            var dd = {},
                position = parseInt((limit.right / 100) * perc, 10);

            dd.offsetX = evDrag.offsetX = position;
            dd.offsetY = evDrag.offsetY = 5;

            dd.offsetX += $sliderContainer.offset().left;

            $sliderHandle.trigger(evDragStart, dd);
            $sliderHandle.trigger(evDrag, dd);
            $sliderHandle.trigger(evDragStop, dd);

            sliderFillWidth = parseInt($sliderFill.css('width'), 10);
            expectedFillWidth = position;
            sliderHandleLeft = parseInt($sliderHandle.css('left'), 10);
            expectedHandleLeft = position;

            expectedValue = parseInt((position / width) * 100, 10);

            deepEqual(sliderHandleLeft, expectedHandleLeft,
                "Slider handle in correct position when dragged to " + perc + "%"
            );
            deepEqual(sliderFillWidth, expectedFillWidth,
                "Slider fill is correct width when dragged to " + perc + "%"
            );
            deepEqual($sliderValue.val(), expectedValue.toString(),
                "Slider value is " +
                expectedValue.toString() +
                " (correct) when dragged to " + perc + "%"
            );
        });
    });
    test('Click slider strip', function() {
        var sliderHandleLeft, sliderFillWidth,
            expectedValue,
            ev = $.Event('mousedown'),
            $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            $sliderFill = $(".slider-fill"),
            $sliderValue = $(".video-seek"),
            width = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            testValues = [370, 23, 500, 152, 290, 874];

        $.each(testValues, function(i, val){
            ev.offsetX = val;
            ev.offsetY = 5;

            $(".slider-strip").trigger(ev);

            sliderHandleLeft = parseInt($sliderHandle.css('left'), 10);
            sliderFillWidth = parseInt($sliderFill.css('width'), 10);

            expectedValue = parseInt((val / width) * 100, 10);

            deepEqual(sliderHandleLeft, val,
                "Slider handle in correct position when clicked at " + val);
            deepEqual(sliderFillWidth, val,
                "Slider fill is correct width when clicked at " + val);
            deepEqual($sliderValue.val(), expectedValue.toString(),
                "Slider value is " +
                expectedValue.toString() +
                " (correct) when when clicked at " + val
            );
        });
    });
    test('Drag on slider strip', function() {
        var sliderHandleLeft, expectedHandleLeft,
            sliderFillWidth, expectedFillWidth,
            expectedValue,
            evDragStart = $.Event('dragstart'),
            evDrag = $.Event('drag'),
            evDragStop = $.Event('dragstop'),
            $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            $sliderFill = $(".slider-fill"),
            $sliderValue = $(".video-seek"),
            width = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            limit = $slider.slider('getLimitObject', $sliderContainer, $sliderHandle),
            testPositionPercentage = [0, 33, 50, 25, 75, 100, 99, 98, 97];

        $.each(testPositionPercentage, function(i, perc) {
            var dd = {},
                position = parseInt((limit.right / 100) * perc, 10);

            dd.deltaX = evDrag.offsetX = position;
            evDrag.offsetY = 5;

            dd.deltaX += $sliderContainer.offset().left - $sliderHandle.offset().left;
            dd.deltaY = 0;

            $sliderContainer.trigger(evDragStart, dd);
            $sliderContainer.trigger(evDrag, dd);
            $sliderContainer.trigger(evDragStop, dd);

            sliderFillWidth = parseInt($sliderFill.css('width'), 10);
            expectedFillWidth = position;
            sliderHandleLeft = parseInt($sliderHandle.css('left'), 10);
            expectedHandleLeft = position;

            expectedValue = parseInt((position / width) * 100, 10);

            deepEqual(sliderHandleLeft, expectedHandleLeft,
                "Slider handle in correct position when dragged to " + perc + "%"
            );
            deepEqual(sliderFillWidth, expectedFillWidth,
                "Slider fill is correct width when dragged to " + perc + "%"
            );
            deepEqual($sliderValue.val(), expectedValue.toString(),
                "Slider value is " +
                expectedValue.toString() +
                " (correct) when dragged to " + perc + "%"
            );
        });
    });
})();