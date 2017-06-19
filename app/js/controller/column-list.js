/**
 * Created by Administrator on 2017/03/08.
 */
angular.module('App.columnListcontrollers', [ ])
    .controller('columnListCtr', ['$scope',  '$state','$rootScope','data','$location','Share','$location',
        function ($scope, $state, $rootScope,data,$location,Share,$location) {
            $scope.data = data;
            $scope.state1 = false;
            $scope.state2 = false;
            $scope.state3 = false;
            $rootScope.setTitle('松果课堂');
            $scope.showDetail = function (idx) {

                console.log($scope.data[idx]);
                console.log($scope.data[idx].id);

                $state.go('introduce', {id: $scope.data[idx].id});

            };
            var img = "http://www.songguolife.com/weixinh5/app/image/logo2.jpg";
            var url = $location.$$absUrl;

            Share.share('松果课堂',"咖啡、艺术、亲子、威士忌······订阅松果生活家的精品音频专栏", img,url);
        }

])
    .controller('columnIntroduceCtr', ['$scope',  '$state','$rootScope','data','DateFormatter','$timeout','$http','locals','Order','Share','$location','CheckLogin',
        function ($scope, $state, $rootScope,data,DateFormatter,$timeout,$http,locals,Order,Share,$location,CheckLogin) {
            $scope.data = data;
            $rootScope.setTitle('课堂详情');
            locals.set("id",$scope.data.id);
            locals.set("name",$scope.data.name);
            locals.set("price",$scope.data.price);
            $scope.freeRead = function () {
                $state.go('free', {id:$scope.data.id,name:$scope.data.name});
            };
            var url = $location.$$absUrl;
            Share.share($scope.data.name,$scope.data.desc,$scope.data.topImage.url,url);


            $scope.hide = function () {
                $scope.state2 = !$scope.state2;
            };
            /*我加的CSS样式控制逻辑开始*/

            console.log($scope.data.id);
            console.log($scope.data.price);
            // $scope.subscribe = true;
            $scope.subscribeButton= function () {
                if (!CheckLogin.check()) {
                    // alert("您还未登录")
                    $http({
                        method:'GET',
                        url:'http://www.songguolife.com/weixin/welCome',
                        params: {
                            'url': url
                        }
                      });
                    return;
                }
                $scope.state1 = true;
                $scope.setTime = $scope.time();

            };
            $scope.user={
                mobile:''
            }
             $scope.continueBtn= function () {
                 if ($scope.user.mobile || $scope.user.mobile!=''){
                     $scope.state1 = false;
                     $scope.state2 = true;
                 }else{
                     $scope.fill = true;
                     return;
                 }
             };
            $scope.focus = function () {
                $scope.fill = false;
            };
             $scope.cancelBtn= function () {
                 $scope.state1 = false;
             };
             $scope.ensureBtn= function () {
                 var id = $scope.data.id;
                 Order.save({gid: id, mobile:$scope.user.mobile,type:3,quantity:1,price:$scope.data.price}, function (res) {
                     $scope.orderid = res.id;
                     if (res.status!=2){
                         $scope.pay();
                     }else{
                         $scope.state2 = false;
                         $scope.state3 = true;
                         // $scope.subscribe = false;
                         $state.go('subscribe', {id:$scope.data.id});
                         $timeout(function () {
                             $scope.state3 = false;
                         },1000)
                     }

                 }, function (res) {
                      alert("订单创建失败");
                 });
             };
             $scope.pay= function () {
                 var config = {
                     headers : {
                         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                     }
                 };
                 var params = {'detail': $scope.data.name ,'desc':' ','goodSn':$scope.data.id};
                 var param = function (obj) {
                     var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

                     for (name in obj) {
                         value = obj[name];

                         if (value instanceof Array) {
                             for (i = 0; i < value.length; ++i) {
                                 subValue = value[i];
                                 fullSubName = name + '[' + i + ']';
                                 innerObj = {};
                                 innerObj[fullSubName] = subValue;
                                 query += param(innerObj) + '&';
                             }
                         }
                         else if (value instanceof Object) {
                             for (subName in value) {
                                 subValue = value[subName];
                                 fullSubName = name + '[' + subName + ']';
                                 innerObj = {};
                                 innerObj[fullSubName] = subValue;
                                 query += param(innerObj) + '&';
                             }
                         }
                         else if (value !== undefined && value !== null)
                             query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                     }

                     return query.length ? query.substr(0, query.length - 1) : query;
                 };

                 params = param(params);
                 var url ='/weixin/order/'+$scope.orderid;
                 $http.post(url,params,config).success(function(data){
                     console.log("发请求");
                     console.log(data);
                     var appId=data.obj.appId;
                     var timeStamp=data.obj.timeStamp;
                     var nonceStr=data.obj.nonceStr;
                     var package=data.obj.package;
                     var paySign=data.obj.paySign;
                     WeixinJSBridge.invoke(
                         'getBrandWCPayRequest', {
                             "appId":appId,     //公众号名称，由商户传入
                             "timeStamp":timeStamp,         //时间戳，自1970年以来的秒数
                             "nonceStr":nonceStr, //随机串
                             "package":package,
                             "signType":"MD5",         //微信签名方式：
                             "paySign":paySign //微信签名
                         },
                         function(res){
                             console.log(res);
                             WeixinJSBridge.log(res.err_msg);
                             console.log(res.err_msg);
                             if(res.err_msg == "get_brand_wcpay_request:ok"){

                                 $scope.state2 = false;
                                 $scope.state3 = true;
                                 // $scope.subscribe = false;
                                 $state.go('subscribe', {id:$scope.data.id});
                                 $timeout(function () {
                                     $scope.state3 = false;
                                 },1000)

                             }else {

                             }
                         }
                     );
                 });


             };
            /*我加的CSS样式控制逻辑结束*/

            // 当出现遮罩层的时候禁止页面滑动事件
            // document.addEventListener("touchmove",
            //     function(e){
            //     if ($scope.state1 || $scope.state2 || $scope.state3){
            //         e.preventDefault();
            //     }
            // },false);
            // 订阅时间
            $scope.time = function () {
                return DateFormatter.subscribeTime();
            }
        }

    ]);