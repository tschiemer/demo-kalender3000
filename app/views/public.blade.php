<!DOCTYPE html>
<html>
    <head>
        
        
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="bower_components/angular-bootstrap-datetimepicker/src/css/datetimepicker.css">
<!--        <link rel="stylesheet" href="bower_components/ngEffeckt.scss/css/effeckt.css">-->
        <link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.min.css">
        <link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css">
        <link rel="stylesheet" href="css/style.css">
        
        <script data-main="js/loader.js" src="bower_components/requirejs/require.js"></script>
    </head>
    <body role="document">
        
        <!-- Fixed navbar -->
        <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" ng-controller="menuController">
          <div class="container" ng-include="'partials/navbar.html'">
          </div>
        </nav>
       
        <div class="container" role="main" ng-view>
                
        </div>
        
    </body>
</html>