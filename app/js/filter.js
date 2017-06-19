/**
 * Created by Action on 17/4/27.
 */
angular.module('App.filter',[])
    .filter('trustUrl', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });