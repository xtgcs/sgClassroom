/**
 * Created by Administrator on 2017/03/08.
 */

angular.module('App.columnFreeListcontrollers', [ ])
    .controller('columnFreeListCtr', ['$scope',  '$state','$rootScope','data','DateFormatter','$stateParams','locals','Share','$location',
        function ($scope, $state, $rootScope,data,DateFormatter,$stateParams,locals,Share,$location) {
            $scope.data = data;
            $rootScope.setTitle(locals.get("name",""));
            $scope.showDetail = function (idx) {
                console.log($scope.data[idx]);
                console.log($scope.data[idx].id);
                $state.go('freeList', {id: $scope.data[idx].id});
                $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                    $rootScope.previousState = from;
                    $rootScope.previousParams = fromParams;
                });
            };

            $scope.formatDate = function (ts) {
                return DateFormatter.formatListDate(ts);
            };
            var img = "http://www.songguolife.com/weixinh5/app/image/logo2.jpg";

                if (locals.get("name","")== "精品咖啡的魅力") {
                    var desc = "咖啡大咖纸寿司，解答你对手冲单品和意式咖啡的好奇疑问。";
                }else if (locals.get("name","")== "读绘本，解决100个育儿问题"){
                    var desc = "亲子教育专家李一慢，用绘本讲读，解决育儿教育的100个问题；";
                }else if (locals.get("name","")== "看懂艺术，从学习艺术史开始"){
                    var desc = "跟中央美术学院李建群教授学艺术史，了解艺术背后的故事。";
                };
                var url = $location.$$absUrl;
                console.log(url);
            Share.share(locals.get("name",""),desc,img,url);
        }

    ])
    .controller('columnFreeReadDetailCtr', ['$scope',  '$state','$rootScope','DateFormatter','$http','data','ArticleComment','$timeout','locals','Order','Share','$location','CheckLogin',
        function ($scope, $state, $rootScope,DateFormatter,$http,data,ArticleComment,$timeout,locals,Order,Share,$location,CheckLogin) {

            $scope.data = data;
            // Page.setTitle('');
            $rootScope.setTitle('');
            $scope.from = locals.get("name","");
            $scope.price = locals.get("price","");
            $scope.id = locals.get("id","");
            $rootScope.mydata=data.id;


            $scope.switch = true;
            $scope.btn = function () {
                 $('#my-player')[0].play();
                  $scope.switch = false;
            }
               // console.log($('#my-player')[0]);
               // if ($('#my-player')[0].play()){
               //   $scope.switch = false;
               // }else{
               //     $scope.switch = true;
               // }

                // var myPlayer = videojs($('.video').find('.video-js'));
                //   myPlayer.ready(function(){
                //     var myPlayer = this;
                //     $scope.play = function () {
                //         myPlayer.play();
                //     }
                //     $scope.pause = function () {
                //         myPlayer. pause();
                //     }
                // });


            $scope.isLoved = function (idx) {
                // var me = $rootScope.me;
                // if (!me)
                //     return false;
                var love = $scope.data.comments[idx].love;

                if (!love || !love.length) {
                    return false;
                }
                // return love.contains(me.id);

                return love;
            };

            $scope.like = function (idx,event) {
                event.stopPropagation();
                var cmt = $scope.data.comments[idx];
                if (!$scope.isLoved(idx)) {
                    ArticleComment.update({id: cmt.id}, {}, function (data) {
                        cmt.love = data;
                    }, function () {
                        alert('操作失败');
                    });
                } else {
                    ArticleComment['delete']({id: cmt.id}, {}, function (data) {
                        cmt.love = data;
                    }, function () {
                        alert('操作失败');
                    });
                }
            };

            $scope.formatDate = function (ts) {
                return DateFormatter.formatCommentDate(ts);
            };

          // $timeout(function () {
          //     if($rootScope.previousState.name!='free'){
          //         $scope.bottom();
          //     }
          // });
          //   $scope.bottom = function () {
          //       var ele = document.body;
          //       ele.scrollTop=ele.scrollHeight;
          //
          //   };
          $scope.hide = function () {
              $scope.state2 = !$scope.state2;
          }
            console.log($scope.id);
            console.log($scope.price);

            /*我加的CSS样式控制逻辑开始*/
            $scope.payState = true;
            // $scope.subscribe = true;
            $scope.subscribeButton= function () {
                var url = $location.$$absUrl;
                if (!CheckLogin.check()) {
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
                var id = $scope.id;

                Order.save({gid: id, mobile:$scope.user.mobile,type:3,quantity:1,price:$scope.price}, function (res) {
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
            //         if ($scope.state1 || $scope.state2 || $scope.state3){
            //             e.preventDefault();
            //         }
            //     },false);
            // // 订阅时间
            $scope.time = function () {
                return DateFormatter.subscribeTime();
            };
            var url = $location.$$absUrl;
            Share.share(data.title,data.desc,data.bannerImage.url,url);

        }

    ]);