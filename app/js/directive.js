/**
 * Created by Administrator on 2017/03/13.
 */
angular.module('audioApp', [])
    .directive('yinPin',function ($interval) {
        return {
            restrict:'AEC',
            replace:'true',
            controller: function () {
            },
            link : function (scope,element,attrs) {
                 scope.state = true;
                //console.log(element);
                scope.audio= function () {
                    var inter= $interval(function () {
                    var duration =  Math.round(element[0].children[2].duration);

                        var Time =Math.round(element[0].children[2].currentTime);
                        var progress = element[0].children[1].children[0];
                        console.log(progress);
                        var percent=  Time/duration*100;
                        progress.style.width=percent+'%';
                        console.log(percent);
                        if(percent>=100){
                            $interval.cancel(inter);
                        }
                    },1000);

                   if(element[0].children[2].paused){

                       element[0].children[2].play();
                       scope.state = false;

                       // element[0].children[0].children[0].innerHTML='&#xe68a;'

                   }else {
                       element[0].children[2].pause();
                       scope.state = true;
                       // element[0].children[0].children[0].innerHTML='&#xe700;'
                   }

                }

            }
        }
        }
    );