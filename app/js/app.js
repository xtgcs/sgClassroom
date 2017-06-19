
/**
 * Created by Administrator on 2017/03/07.
 */
var angular = require('angular');//引入angular
require('./controller/column-list.js');
require('./controller/comment-List.js');
require('./controller/controller.js');
require('./controller/list-freeRead.js');
require('./controller/subscribe-list.js');
require('./directive.js');
require('./service.js');
require('./filter');
require('../css/subscribe.css');//引入样式文件
require('../css/column-list.css');//引入样式文件
require('../css/clickComments.css');//引入样式文件
require('../css/column-introduce.css');//引入样式文件
require('../css/comment.css');//引入样式文件
require('../css/freeRead-Detail.css');//引入样式文件
require('../css/list-freeRead.css');//引入样式文件
require('../css/normalize.css');//引入样式文件

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