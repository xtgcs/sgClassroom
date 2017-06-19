webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Created by Administrator on 2017/03/15.
 */
angular.module('App.CommentList', [])
    .controller('commentCtrl',
        ['$scope', '$http','ImageUploader','Article','data','token','$state','$timeout','$window','FileUploader','Resource',
            function ($scope, $http,ImageUploader,Article,data,token,$state,$timeout,$window,FileUploader,Resource) {
                $scope.data = data;
                $scope.PhotoStatus=false;
                $scope.uploadPhoto= function () {
                    $scope.PhotoStatus= !$scope.PhotoStatus;
                };
                $scope.cancel= function () {
                    $scope.PhotoStatus= !$scope.PhotoStatus;
                };
                /* Comment Operations */
                $scope.comment = {
                    text: '',
                    image: []
                };
                $scope.uploader = ImageUploader.initUploader($scope, token, function (r) {
                    $scope.PhotoStatus= !$scope.PhotoStatus;
                    $scope.comment.image.push(r);
                });

                $scope.sendComment = function () {

                    $scope.comment.text = $scope.comment.text.trim();
                    if (!$scope.comment.text) {
                        alert('请输入评论内容');
                        return;
                    }
                    var comment = {
                        text: $scope.comment.text,
                        image: []
                    };
                    if ($scope.comment.image.length > 0) {
                        comment.image.push($scope.comment.image[0].id);
                    }
                    console.log($scope.data.id);
                    Article.reply.save({id: $scope.data.id}, comment, function () {
                        console.log('评论成功');
                       /* Article.get({id: $scope.data.id}, function (o) {
                            $scope.data = o;
                            $scope.comment = {
                                text: '',
                                image: []
                            };
                            //$state.go('freeList', {id: $scope.data.id});
                        });*/
                    }, function () {
                        alert('评论失败');
                    });
                };

            }])
    .controller('CommentsCtrl',['$scope','$http','$rootScope','data','ArticleComment','DateFormatter','$state','ImageUploader','token',
        'Article', '$timeout',
        function ($scope,$http,$rootScope,data,ArticleComment,DateFormatter,$state,ImageUploader,token,Article,$timeout) {
            $scope.data=data;
            console.log(data);
            /*改变状态样式*/
            $scope.temp = [];
            angular.forEach($scope.data, function(data){
                $scope.temp.push(false);
            });
            $scope.Popup= function(index){
                 console.log(index);
                if ($scope.temp[index]){
                    $scope.temp[index]=false;
                    return
                }else{
                    $scope.temp[index]=true;

                }
                for(i=0;i<$scope.temp.length;i++){

                    if(i==index){
                        $scope.temp[index]=true;
                    }else {
                        $scope.temp[i]=false;

                    }
                }
                //console.log( $scope.temp)

            };
            $scope.isLoved = function (idx) {
                // var me = $rootScope.me;
                // if (!me)
                //     return false;
                //var love = $scope.data.comments[idx].love;

                var love = $scope.data[idx].love;

                if (!love || !love.length) {
                    return false;
                }
                // return love.contains(me.id);
                return love;
            };
            $scope.like = function (idx,event) {
                event.stopPropagation();
                if ($scope.temp[idx]){
                    $scope.temp[idx]=false;
                }else{
                    for(i=0;i<$scope.temp.length;i++){
                        $scope.temp[i]=false;
                    }
                }
                var cmt = $scope.data[idx];
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
            /*回复评论*/

            $scope.replyComments= function (idx) {
                console.log($scope.data[idx].aid);
                b=idx;
                console.log(b);
              $state.go('replyComments', {id: $scope.data[idx].aid,replayUid:$scope.data[idx].uid});
                     $rootScope.Name= $scope.data[idx].user.nick;
            };

            /* Comment Operations */
            $scope.comment = {
                text: '',
                image: []
            };
            $scope.uploader = ImageUploader.initUploader($scope, token, function (r) {
                $scope.PhotoStatus= !$scope.PhotoStatus;

                $scope.comment.image.push(r);
            });
            $scope.removeImage = function () {
                $scope.comment.image = [];
            };

            $scope.sendComment = function () {
                $scope.comment.text = $scope.comment.text.trim();
                if (!$scope.comment.text) {
                    alert('请输入评论内容');
                    return;
                }

                var comment = {
                    //text: $scope.comment.text,
                    text: '@'+$rootScope.Name+' '+$scope.comment.text,
                    image: [],
                    replyUid:$scope.data[b].user.id
                };
                if ($scope.comment.image.length > 0) {
                    comment.image.push($scope.comment.image[0].id);
                }

                Article.reply.save({id: $scope.data[b].aid},
                    comment, function () {
                    /* Article.get({id: $scope.data.id}, function (o) {
                       $scope.data = o;
                        $scope.comment = {
                            text: '',
                            image: []
                        };
                        $state.go('clickComments', {id: $scope.data.id});
                    });*/
                }, function () {
                    alert('评论失败');
                });
            };

            /*举报用户的状态*/
            $scope.reportStatus=false;

            $scope.reportUser= function(index,event){
                event.stopPropagation();
                $scope.reportStatus =true;
                $scope.ids = index;
                if ($scope.temp[index]){
                    $scope.temp[index]=false;
                }else{
                    $scope.temp[index]=true;
                }
                console.log($scope.temp);

            };
            $scope.reportContinue= function(){
                $scope.reportSuccess =true;
                $scope.reportStatus =false;
                //后加的
                console.log($scope.ids);
                var cmt = $scope.data[$scope.ids];
                console.log(cmt);
                ArticleComment.report.commit({commentId: cmt.id},{}, function () {
                    alert('举报成功');

                    $timeout(function () {
                        $scope.reportSuccess =false;
                    },1000)


                }, function () {
                    alert('操作失败');
                });



            };
            $scope.reportCancel= function(){
                console.log(12);
                $scope.reportStatus =false;
            };
            /*删除自己评论的状态*/
            $scope.deleteStatus=false;
            $scope.removeStatus =true;

            $scope.deleteUser= function(index,event){
                event.stopPropagation();
                $scope.deleteStatus =true;

                $scope.ids = index;
                if ($scope.temp[index]){
                    $scope.temp[index]=false;
                }else{
                    $scope.temp[index]=true;
                }

                console.log($scope.temp);

            };
            $scope.deleteContinue= function(){
                $scope.deleteStatus =false;
                console.log( $scope.ids);
                var cmt = $scope.data[$scope.ids];
                console.log(cmt);
                ArticleComment.del['delete']({commentId: cmt.id}, function () {
                    $scope.data.splice($scope.ids, 1);
                }, function () {
                    $scope.data.splice($scope.ids, 1);
                    // alert('操作失败');
                });
            };

            $scope.deleteCancel= function(){
                $scope.deleteStatus =false;
            };
            /*照片提交状态*/
            $scope.PhotoStatus=false;
            $scope.uploadPhoto= function () {
                $scope.PhotoStatus= !$scope.PhotoStatus;
            };
            $scope.cancel= function () {
                $scope.PhotoStatus= !$scope.PhotoStatus;
            }
            $scope.formatDate = function (ts) {
                return DateFormatter.formatCommentDate(ts);
            };
        }]);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

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

/***/ }),
/* 4 */
/***/ (function(module, exports) {

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

/***/ }),
/* 5 */
/***/ (function(module, exports) {

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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

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

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * Created by Action on 17/4/27.
 */
angular.module('App.filter',[])
    .filter('trustUrl', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Administrator on 2017/03/07.
 */

/* Services */
angular.module('App.services', [])
    .value('version', 'v1.0')
    .factory('Columns', ['$resource','API', function ($resource,API) {
        var API = API.url;
        var Columns = $resource(API+'/api/columns',{
            //'query': {method: 'GET', isArray: true}
        });
        return Columns;
    }])
    .factory('Live', ['$resource','API', function ($resource,API) {
        var API = API.url;
        var Live = $resource(API+'/api/live/:id',{id:'@id'},{
            'query': {method: 'GET', isArray: true}
        });
        return Live;
    }])
    .factory('Column', ['$resource','API', function ($resource,API) {
        var API = API.url;
        var Column = $resource(API+'/api/column/:id', {id: '@id'}, {
            'query': {method: 'GET', isArray: true}
        });
          Column.articles = $resource(API+'/api/column/:id/articles', {id: '@id'}, {
            'query': {method: 'GET', isArray: true}
        });
        return Column;
    }])
    .factory('Article', ['$resource','API', function ($resource,API) {
        var API = API.url;
        var Article = $resource(API+'/api/article/:id', {id: '@id'}, {
            'query': {method: 'GET', isArray: true}
        });
        Article.favorite = $resource(API+'/api/article/:id/fav', {id: '@id'}, {
            'update': {method: 'POST'}
        });
        Article.cmt = $resource(API+'/api/article/:id/comments', {id: '@id'});
        Article.reply = $resource(API+'/api/article/:id/comment',
            {id: '@id',replyUid :'@uid'});
        /*Article.comment=$resource(API+'/api/article/:id/comment',{id:'@id'},{
            'replay':{method:'POST',}
        })*/
        return Article;
    }])
    .factory('Resource', ['$resource','API', function ($resource,API) {
        var API = API.url;
        var Resource = $resource(API+'/portal/resource/:id', {id: '@id'}, {
            'update': {method: 'POST'}
        });
        Resource.batch = $resource(API+'/portal/resource/batch', {}, {
            'get': {method: 'POST'}
        });
        Resource.getId = $resource(API+'/portal/resource/getId');
        Resource.token = $resource(API+'/portal/qiniu/token');
        return Resource;
    }])
    .factory('ArticleComment', ['$resource','API', function ($resource,API) {
        var API = API.url;
        var Cmt = $resource(API+'/api/article/comment/:id/love', {id: '@id'}, {
            'update': {method: 'POST', isArray: true},
            'delete': {method: 'DELETE', isArray: true}
        });
        Cmt.report =
            $resource(API+'/api/article/comment/:commentId/report', {commentId:'@commentId'},
             {'commit': {method: 'DELETE'}
        });

        Cmt.del=$resource(API+'/api/article/comment/:commentId', {commentId: '@commentId'});
        return Cmt;
    }])
    .factory('Order', ['$resource', function ($resource) {
        var Order = $resource('/api/order/:id', {id: '@id'}, {
            'update': {method: 'POST'}
        });
        Order.deliver = $resource('/api/order/:id/deliver', {id: '@id'}, {
            'commit': {method: 'POST'}
        });
        Order.modify = $resource('/api/order/:orderId/status', {id: '@orderId'}, {
            'update': {method: 'POST'}
        });
        return Order;
    }])
    .factory('User', ['$resource','API', function ($resource,API) {
        var API = API.url;
          var  User = $resource(API+'/api/me', {}, {
            'update': {method: 'POST'}
        });
        return User;
    }])
    .service('CheckLogin', ['$rootScope', function ($rootScope) {
        this.check = function () {
            if ($rootScope.login) {

                return true;
            }
            return false;
        }
    }])
    .service('DateFormatter', [function (){
        var service = {};

        function formatDate(d) {
            return d.getFullYear()+'-'+(d.getMonth() + 1) + '-' + d.getDate();
        }

        function formatDate1(d) {
            return (d.getMonth() + 1) + '月' + d.getDate()+"日";
        }
        function formatNumber(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return '' + n;
            }
        }

        function years(d) {
            var date = new Date(d);
            date.setDate(d.getDate()+365);
            return date;
        }

        service.formatActivityDate = function (ts) {
            var date = new Date(ts);
            return formatDate(date) + ' ' + formatNumber(date.getHours()) + ':' + formatNumber(date.getMinutes());
        };

        service.formatCommentDate = function (ts) {
            return formatDate1(new Date(ts));
        };
        service.formatListDate = function (ts) {
            return formatDate(new Date(ts));
        };

        service.formatLiveDate = function (ts) {
            var date = new Date(ts);
            var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            return formatNumber(date.getMonth() + 1) + '-' + formatNumber(date.getDate()) + ' ' + formatNumber(date.getHours()) + ':' + formatNumber(date.getMinutes()) + ' ' + weekdays[date.getDay()];
        };
        service.formatNowTime = function () {

            return new Date().getTime();
        };
        service.subscribeTime = function () {
            var date = new Date();
            var date2 = years(date);
            return formatDate(date) +  '至' + formatDate(date2);

        };
        return service;
    }])
    .service('Share', ['$location',function ($location){

        console.log(location.href.split("#")[0]);
        var service = {};
           service.share = function (m,e,a,t) {
               console.log(m , e);
               service.m =m;
               service.e =e;
               service.a =a;
               service.t =t;
               console.log(t);

               $.ajax({
                type : "get",
                url: "http://www.songguolife.com/weixin/share",
                data: {
                    url: t
                },
                   dataType: "jsonp",
                   jsonp: "jsonpCallback",
                   jsonpCallback:"jsonpCallback"

               }).success(function(n) {

                wx.config({
                        // debug: true,
                        appId: n.appId,
                        timestamp: n.timestamp,
                        nonceStr: n.noncestr,
                        signature: n.signature,
                        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
                    },
                    wx.ready(function() {
                        var m = service.m,
                            e = service.e,
                            a = service.a,
                            t = service.t;
                        wx.onMenuShareTimeline({
                                title: m,
                                link: t,
                                imgUrl: a,
                                success: function() {
                                    console.log("分享");
                                },
                                cancel: function() {}
                            },
                            wx.onMenuShareAppMessage({
                                title: m,
                                desc: e,
                                link: t,
                                imgUrl: a,
                                type: "",
                                dataUrl: "",
                                success: function() {
                                    console.log("分享2");
                                },
                                cancel: function() {}
                            }))

                    }))
            })
        };

        return service;
    }])

    .service('ImageUploader', ['$log', '$http', 'FileUploader', 'Resource', function ($log, $http, FileUploader, Resource) {
        this.initUploader = function ($scope, token, done) {
            var uploader = new FileUploader({
                url: 'http://upload.qiniu.com',
                alias: 'file',
                queueLimit: 1,
                removeAfterUpload: true,
                formData: [
                    {
                        accept: 'text/plain; charset=utf-8',
                        "token": token.token
                    }
                ]
            });
            //document.domain = 'uptx.qiniu.com';
            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function () {
                    return this.queue.length < 1;
                }
            });

            uploader.filters.push({
                name: 'imageFilter',
                fn: function (item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|'.indexOf(type) !== -1;
                }
            });

            // CALLBACKS
            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {
                // if (!CheckLogin.check()) {
                //     uploader.removeFromQueue(fileItem);
                //     return;
                // }
                console.info('onAfterAddingFile', fileItem);
                Resource.getId.get(function (res) {
                    $log.info("resource id:", res.id);
                    fileItem.resId = res.id;
                    fileItem.formData.push({"key": res.id});
                    fileItem.upload();
                    $scope.uploading = true;
                }, function (res) {
                    $scope.uploading = false;
                });
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function (item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);

                function saveResource(resource) {
                    $log.info('create resource:', resource);
                    Resource.save(resource, function () {
                        $log.info("create resource successfully");
                        if (resource.key) {
                            Resource.batch.get({}, {'ids': [resource.key]}, function (data) {
                                if (data.data.length) {
                                    done(data.data[0]);
                                }
                            });
                        }
                        $scope.uploading = false;
                    }, function (res) {
                        $scope.uploading = false;
                    });
                }

                /* IE8,9下，跨域上传会导致response为undefined，针对这种情况，上传后，通过尝试加载来判断上传是否成功了 */
                if (response) {
                    var resource = {name: fileItem.file.name, tp: 0, key: response.key, hash: response.hash};
                    saveResource(resource);
                } else {
                    var url = 'http://' + token.imageDomain + '/' + fileItem.resId + '?imageView2/0/w/640';
                    var img = new Image(); //创建一个Image对象，实现图片的预下载
                    img.onload = function(){
                        var resource = {name: fileItem.file.name, tp: 0, key: fileItem.resId};
                        saveResource(resource);
                    };
                    img.onerror = function () {
                        // Alert.alert('上传失败', true);
                        $scope.uploading = false;
                    };
                    img.src = url;
                }
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                // Alert.alert('上传失败', true);
                console.info('onErrorItem', fileItem, response, status, headers);
                $scope.uploading = false;
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
            };

            return uploader;
        }
    }])
    .service('CookieService', ['$window', function ($window){
        var service = {};

        function setCookie(name, value, path, iDay){
            /* iDay 表示过期时间
             cookie中 = 号表示添加，不是赋值 */
            var oDate=new Date();
            oDate.setDate(oDate.getDate()+iDay);
            document.cookie=name+'='+value+';path=' + path + ';expires='+oDate;
        }

        function getCookie(name){
            /* 获取浏览器所有cookie将其拆分成数组 */
            var arr=document.cookie.split('; ');

            for(var i=0;i<arr.length;i++)    {
                /* 将cookie名称和值拆分进行判断 */
                var arr2=arr[i].split('=');
                if(arr2[0]==name){
                    return arr2[1];
                }
            }
            return '';
        }

        function removeCookie(name, path){
            /* -1 天后过期即删除 */
            setCookie(name, 1, path, -1);
        }

        service.get = function (key) {
            return getCookie(key);
        };

        service.remove = function (key, path) {
            removeCookie(key, path);
        };

        return service;
    }]);


/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 17 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 19 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 20 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Created by Administrator on 2017/03/07.
 */
var angular = __webpack_require__(0);//引入angular
__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(8);
__webpack_require__(7);
__webpack_require__(22);//引入样式文件
__webpack_require__(17);//引入样式文件
__webpack_require__(15);//引入样式文件
__webpack_require__(16);//引入样式文件
__webpack_require__(18);//引入样式文件
__webpack_require__(19);//引入样式文件
__webpack_require__(20);//引入样式文件
__webpack_require__(21);//引入样式文件

angular.module('App',['ui.router','App.columnListcontrollers','App.columnFreeListcontrollers','App.columnSubscribecontrollers','App.services','App.filter','App.controller','ngResource','audioApp','App.CommentList','angularFileUpload','ngSanitize',

])
    .constant('API', {
        // url:'/songguoAPI'
        url:''
    })
    .config(['$stateProvider','$urlRouterProvider',
        function ($stateProvider,$urlRouterProvider) {
            $urlRouterProvider.otherwise("/column");
            $stateProvider
                .state('column',{
                    title: '松果课堂',
                    resolve: {
                        data: function (Columns) {
                            return Columns.query({size: 20,columnType:1}).$promise;
                        }
                    },
                    url:'/column',
                    templateUrl:'partials/column-list.html',
                    controller: 'columnListCtr'
                })

                .state('introduce', {
                    title: '课堂介绍',
                    resolve: {
                        data: function (Column, $stateParams) {
                            return Column.get({id: $stateParams.id}).$promise;
                        }
                    },
                    url: '/introduce/:id',
                    templateUrl: 'partials/column-introduce.html',
                    controller: 'columnIntroduceCtr'
                })
                .state('free', {
                    resolve: {
                        data: function (Column,$stateParams) {
                            return Column.articles.query({id: $stateParams.id,title:$stateParams.name,size: 5}).$promise;
                        }
                    },
                    url: '/free/:id',
                    templateUrl: 'partials/list-freeRead.html',
                    controller: 'columnFreeListCtr'

                })
                .state('subscribe', {
                    resolve: {
                        data: function (Column,$stateParams) {
                            return Column.articles.query({id: $stateParams.id,size: 5}).$promise;
                        },
                        column: function (Column, $stateParams) {
                            return Column.get({id: $stateParams.id}).$promise;
                        },
                    },
                    url: '/subscribe/:id',
                    templateUrl: 'partials/subscribe-list.html',
                    controller: 'columnSubscribeCtr'

                })
                .state('freeList', {
                    resolve: {
                        data: function (Article, $stateParams) {
                            return Article.get({id: $stateParams.id}).$promise;
                        }
                    },
                    url: '/freeList/:id',
                    templateUrl: 'partials/freeRead-Detail.html',
                    controller: 'columnFreeReadDetailCtr'

                })
                .state('comment', {
                    resolve: {
                        data: function (Article, $stateParams) {
                            return Article.get({id: $stateParams.id}).$promise;
                        },
                        token: function (Resource) {
                            return Resource.token.get().$promise;
                        }
                    },
                    url: '/comment/:id',
                    templateUrl: 'partials/comment.html',
                    controller: "commentCtrl"

                })
                .state('replyComments', {
                    resolve: {

                        data: function (Article, $stateParams) {
                            return Article.cmt.query({id: $stateParams.id}).$promise;
                        },
                       /* data: function (Article, $stateParams) {
                            return Article.tijiao.reply({id: $stateParams.id},{replayUid:$stateParams.replayUid}).$promise;

                        },*/
                        token: function (Resource) {
                            return Resource.token.get().$promise;
                        }
                    },
                    url: '/replyComment/:id/:replyUid',
                    templateUrl: 'partials/reply-comments.html',
                    controller:'CommentsCtrl'
                })
                .state('clickComments', {
                    resolve: {
                        data: function (Article, $stateParams) {
                            return Article.cmt.query({id: $stateParams.id}).$promise;
                        },
                        token: function (Resource) {
                            return Resource.token.get().$promise;
                        }
                    },
                    url: '/clickComments/:id',
                    templateUrl: 'partials/clickComments.html',
                    controller: 'CommentsCtrl'
                });

        }])
    .factory('setTitle', function () {
    //定义参数对象
    var myObject = {};
        myObject.list =[];

    /**
     * 定义传递数据的setter函数
     * @param {type} xxx
     * @returns {*}
     * @private
     */
    var _setter = function (data) {
        myObject.list.push(data);;

    };

    /**
     * 定义获取数据的getter函数
     * @param {type} xxx
     * @returns {*}
     * @private
     */
    var _getter = function () {
        return myObject;
    };

    // Public APIs
    // 在controller中通过调setter()和getter()方法可实现提交或获取参数的功能
    return {
        setter: _setter,
        getter: _getter
    };
}).factory('locals',['$window',function($window){
    return{        //存储单个属性
        set :function(key,value){
            $window.localStorage[key]=value;
        },        //读取单个属性
        get:function(key,defaultValue){
            return  $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject:function(key,value){
            $window.localStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }

    }
}]);

/***/ })
],[23]);