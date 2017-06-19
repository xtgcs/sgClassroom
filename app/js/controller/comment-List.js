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