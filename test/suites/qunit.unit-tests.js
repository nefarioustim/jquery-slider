(function() {
    // Declare some variables for reuse with test modules
    var $slider,
        sliderClass = ".video-seek";

    //--------------------------------

    module("Unit tests on exposed functions", {
        setup: function() {
            // Setup default slider for the following tests
            $slider = $(sliderClass).slider();
        }
    });

    //--------------------------------

    test("getLimitObject success", function() {
        var $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            expectedLeft = 0,
            expectedRight = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            limit = $slider.slider("getLimitObject", $sliderContainer, $sliderHandle);

        deepEqual(
            limit.constructor,
            Object,
            "Returned an object"
        );
        ok(
            limit.hasOwnProperty("left") && limit.hasOwnProperty("right"),
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
    test("confinePositionToLimit success", function() {
        var $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            limit = $slider.slider("getLimitObject", $sliderContainer, $sliderHandle),
            values = [
                { value: limit.left, expected: limit.left },
                { value: limit.right, expected: limit.right },
                { value: limit.left - 25, expected: limit.left },
                { value: limit.right + 25, expected: limit.right },
                { value: parseInt((limit.left + limit.right) / 2, 10), expected: parseInt((limit.left + limit.right) / 2, 10) }
            ];

        $.each(values, function(i, val) {
            deepEqual(
                $slider.slider("confinePositionToLimit", val.value, limit),
                val.expected,
                "Returns " + val.expected + " when passed " + val.value
            );
        });
    });
    test("setPosition success without setting value", function() {
        var $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            $sliderFill = $(".slider-fill"),
            $sliderValue = $(".video-seek"),
            sliderFillWidth, expectedFillWidth,
            sliderHandleLeft, expectedHandleLeft,
            expectedValue,
            width = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            position = 531;

        $slider.slider("setPosition", position, false);

        sliderFillWidth = parseInt($sliderFill.css("width"), 10);
        expectedFillWidth = position;
        sliderHandleLeft = parseInt($sliderHandle.css("left"), 10);
        expectedHandleLeft = position;

        expectedValue = 0;

        deepEqual(sliderHandleLeft, expectedHandleLeft,
            "Slider handle in correct position when setPosition passed " + position
        );
        deepEqual(sliderFillWidth, expectedFillWidth,
            "Slider fill is correct width when setPosition passed " + position
        );
        deepEqual($sliderValue.val(), expectedValue.toString(),
            "Slider value is " +
            expectedValue.toString() +
            " (correct) when when clicked at " + position
        );
    });
    test("setPosition success and set value", function() {
        var $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            $sliderFill = $(".slider-fill"),
            $sliderValue = $(".video-seek"),
            sliderFillWidth, expectedFillWidth,
            sliderHandleLeft, expectedHandleLeft,
            expectedValue,
            width = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            val = 20;

        $slider.slider("setPosition", val);

        sliderFillWidth = parseInt($sliderFill.css("width"), 10);
        expectedFillWidth = val;
        sliderHandleLeft = parseInt($sliderHandle.css("left"), 10);
        expectedHandleLeft = val;

        expectedValue = parseInt((val / width) * 100, 10);

        deepEqual(sliderHandleLeft, expectedHandleLeft,
            "Slider handle in correct position when setPosition passed " + val
        );
        deepEqual(sliderFillWidth, expectedFillWidth,
            "Slider fill is correct width when setPosition passed " + val
        );
        deepEqual($sliderValue.val(), expectedValue.toString(),
            "Slider value is " +
            expectedValue.toString() +
            " (correct) when when clicked at " + val
        );
    });
    test("setValue success", function() {
        var $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            $sliderFill = $(".slider-fill"),
            $sliderValue = $(".video-seek"),
            width = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            val = 20;

        $slider.slider("setValue", val);

        deepEqual(parseInt($sliderValue.val(), 10), val, "Slider value is " + val);
    });

    //--------------------------------

    module("Unit tests on init function");

    //--------------------------------

    test("Validate markup", function() {
        $slider = $(sliderClass).slider();

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
    test("Default 'max' is 100", function() {
        $slider = $(sliderClass).slider();

        var $sliderContainer = $(".slider-container"),
            $sliderHandle = $(".slider-handle"),
            $sliderValue = $(".video-seek"),
            maxRight = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
            expectedValue = 100;

        $slider.slider("setPosition", maxRight);

        deepEqual(
            parseInt($sliderValue.val(), 10),
            expectedValue,
            "Slider value is " + expectedValue
        );
    });
    test("Multiple 'max' values", function() {
        var values = [10, 20, 123, 1985, 20105],
            fixtureHTML = document.getElementById("qunit-fixture").innerHTML;

        $.each(values, function(i, val) {
            document.getElementById("qunit-fixture").innerHTML = fixtureHTML;

            $slider = $(sliderClass).slider({max: val});

            var $sliderContainer = $(".slider-container"),
                $sliderHandle = $(".slider-handle"),
                $sliderValue = $(".video-seek"),
                maxRight = $sliderContainer.outerWidth() - $sliderHandle.outerWidth(),
                expectedValue = val;

            $slider.slider("setPosition", maxRight);

            deepEqual(
                parseInt($sliderValue.val(), 10),
                expectedValue,
                "Slider value is " + expectedValue
            );
        });
    });
    test("Default 'value' is 0", function() {
        $slider = $(sliderClass).slider();

        var $sliderValue = $(".video-seek"),
            expectedValue = 0;

        deepEqual(
            parseInt($sliderValue.val(), 10),
            expectedValue,
            "Slider value is " + expectedValue
        );
    });
    test("Multiple 'value' values", function() {
        var values = [10, 20, 42, 100, 1],
            fixtureHTML = document.getElementById("qunit-fixture").innerHTML;

        $.each(values, function(i, val) {
            document.getElementById("qunit-fixture").innerHTML = fixtureHTML;

            $slider = $(sliderClass).slider({value: val});

            var $sliderValue = $(".video-seek"),
                expectedValue = val;

            deepEqual(
                parseInt($sliderValue.val(), 10),
                expectedValue,
                "Slider value is " + expectedValue
            );
        });
    });
    test("Default 'hideInput' is false", function() {
        $slider = $(sliderClass).slider();

        var $sliderValue = $(".video-seek"),
            expectedValue = 'text';

        deepEqual(
            $sliderValue.prop('type'),
            expectedValue,
            "Slider text input type is " + $sliderValue.prop('type')
        );
    });
    test("Input hidden when 'hideInput' is true", function() {
        $slider = $(sliderClass).slider({hideInput:true});

        var $sliderValue = $(".video-seek"),
            expectedValue = 'hidden';

        deepEqual(
            $sliderValue.prop('type'),
            expectedValue,
            "Slider text input type is " + $sliderValue.prop('type')
        );
    });
})();