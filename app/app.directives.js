app.directive('onMouseHold', function ($parse, $interval) {
    var stop;

    var dirDefObj = {
        restrict: 'A',
        scope: { method: '&onMouseHold' },
        link: function (scope, element, attrs) {
            var expressionHandler = scope.method();
            var actionInterval = (attrs.mouseHoldRepeat) ? attrs.mouseHoldRepeat : 150;

            var startAction = function () {
                expressionHandler();
                stop = $interval(function () {
                    expressionHandler();
                }, actionInterval);
            };

            var stopAction = function () {
                if (stop) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            };

            element.bind('mousedown', startAction);
            element.bind('mouseup', stopAction);
            element.bind('mouseout', stopAction);
        }
    };

    return dirDefObj;
});

app.directive('ngMouseWheelUp', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                
                        if(delta > 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelUp);
                            });
                        
                            // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault) {
                                event.preventDefault();                        
                            }

                        }
            });
        };
});

app.directive('ngMouseWheelDown', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                
                        if(delta < 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelDown);
                            });
                        
                            // for IE
                            event.returnValue = false;
                            // for Chrome and Firefox
                            if(event.preventDefault)  {
                                event.preventDefault();
                            }

                        }
            });
        };
});