/**
 * Created by Administrator on 2017/03/08.
 */
angular.module('App.controller', [ ])
    .controller('MyCtr', ['$scope',  '$state','$rootScope','User','CookieService',
        function ($scope, $state, $rootScope,User,CookieService) {
            $rootScope.setTitle = function (title) {
                $('title').text(title);
            };
            (function () {
                var cookie = CookieService.get('UID');
                if (cookie) {
                    try {
                        var o = angular.fromJson($base64.decode(cookie));
                        $timeout(function () {
                        }, 1000);
                    } catch (e) {
                        console.log(e);
                    }
                    CookieService.remove('UID', '/');
                }
            })();

            var newVisitor = isNewVisitor();// 如果是新访客
            if (newVisitor === false) {
               $rootScope.login = false;
            }else{
                $rootScope.login = true;
            };

            function isNewVisitor() {
                // 从cookie读取“已经向访客提示过消息”的标志位
                var cookie = CookieService.get('UID');
                if (cookie === "") {
                    return false;
                } else {
                    return true;
                }
            }

        }
])