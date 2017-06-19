/**
 * Created by Administrator on 2017/03/08.
 */
angular.module('App.columnSubscribecontrollers', [ ])
    .controller('columnSubscribeCtr', ['$scope',  '$state','$rootScope','data','DateFormatter','$stateParams','column','locals','Share','$location',
        function ($scope, $state, $rootScope,data,DateFormatter,$stateParams,column,locals,Share,$location) {
            $scope.data = data;
            $scope.column = column;
            $rootScope.setTitle(locals.get("name",""));
            $scope.showDetail = function (idx) {
                console.log($scope.data[idx]);
                console.log($scope.data[idx].id);
                $state.go('freeList', {id: $scope.data[idx].id});

            };
            $scope.formatDate = function (ts) {
                return DateFormatter.formatListDate(ts);
            };
            var img = "http://www.songguolife.com/weixinh5/app/image/logo2.jpg";
            if (locals.get("name","")== "纸寿司：精品咖啡的魅力") {
                var desc = "咖啡大咖纸寿司，解答你对手冲单品和意式咖啡的好奇疑问。";
            }else if (locals.get("name","")== "李一慢：读绘本，解决100个育儿问题"){
                var desc = "亲子教育专家李一慢，用绘本讲读，解决育儿教育的100个问题；";
            }else if (locals.get("name","")== "李建群：看懂艺术，从学习艺术史开始"){
                var desc = "跟中央美术学院李建群教授学艺术史，了解艺术背后的故事。";
            }
            var url = $location.$$absUrl;
            Share.share(locals.get("name",""),desc,img,url);
        }

]);