angular.module('App').run(["$templateCache", function($templateCache) { $templateCache.put("src/Directions.html", '<section class=directions ng-cloak layout=column><div class=legs layout=column><header><h3><md-icon md-svg-icon=directions></md-icon>Step by step directions</h3><p>Total {{totalDuration.min}} min ({{totalDistance.km}} km)</header><div class=leg ng-repeat="leg in directions.route.legs" layout=column><div class=start><div class=place ng-if=leg.start_place><div class=place-title><md-icon md-svg-icon=walk></md-icon><strong>{{leg.start_place.label}}</strong> {{leg.duration.text}} ({{leg.distance.text}})</div><div class=place-content><p ng-repeat="p in leg.start_marker.mark.content">{{p}}</div><div class=place-address>{{leg.start_address}}</div></div></div><div class=steps><p class=step ng-repeat="step in leg.steps"><span class=maneuver ng-class=step.maneuver></span> <span class=instruction ng-bind-html=step.instructions></span></div><div class=end ng-if=$last><div class=place ng-if=leg.end_place><div class=place-title><md-icon md-svg-icon=place_dark></md-icon><strong>{{leg.end_place.label}}</strong> {{leg.duration.text}} ({{leg.distance.text}})</div><div class=place-content><p ng-repeat="p in leg.end_address.mark.content">{{p}}</div><div class=place-address>{{leg.end_address}}</div></div></div></div></div><span flex></span><div layout=column layout-align=center><md-button aria-label=Close>Close</md-button></div></section>');
$templateCache.put("src/LoadingRoute.html", '<div class=loading-route-content layout=column><h2>Generating route</h2><p>Hang there! We are tring to find the best optimized route for you.<div class=loading><md-progress-linear class=md-warn md-mode=buffer value={{value}} md-buffer-value={{bufferValue}}></md-progress-linear></div><md-button ng-click=cancel() aria-label=Cancel layout-align="center center">Cancel</md-button></div>');
$templateCache.put("src/MarkerDetail.html", '<div class=marker-detail layout=column><header background-image={{marker.place.media.x3}} layout=row layout-align="end start" class=fade ng-if=true><md-button class="close md-primary md-button" aria-label=Close ng-click=closeDialog()><md-icon md-svg-icon=close></md-icon></md-button></header><section class=fade ng-if=true><h2 class=md-headline>{{marker.place.label}}</h2><div class=marker-details-content><p ng-repeat="p in marker.place.content">{{p}}</div></section><span flex></span><footer layout=row class=fade ng-if=true><div layout=row layout-align="start center"><img class=avatar ng-src={{marker.place.author.picture}}> <span>{{marker.place.author.name}},<br>{{marker.place.author.role}}</span></div><span flex></span><div layout=row layout-align="end center"><md-button class="md-raised md-secondary" ng-click=setStart()>Set start</md-button><md-button class="md-raised md-secondary" ng-click=setEnd()>Set end</md-button><md-button class="md-raised md-primary" ng-click=removeFromRoute() ng-if=marker.place.selected>Remove</md-button><md-button class="md-raised md-primary" ng-click=addToRoute() ng-if=!marker.place.selected>Add to the route</md-button></div></footer></div>');
$templateCache.put("src/SelectingPlacesDirective.html", '<md-content layout=column><md-subheader><h1>Select the places you want to visit</h1><p>Our brand ambassadors have hand-picked their favorite spots in Amsterdam</p></md-subheader><div class="places-by-category layout-padding" ng-repeat="(key, value) in app.placesByCategory" ng-if=value.length><h3>{{key}} ({{value.length}})</h3><div class=places layout=row layout-align="start none" layout-wrap><md-card class=place ng-repeat="place in value" flex=20 ng-class="{selected: place.selected}"><label for=place{{place.id}} layout=row layout-align="space-between center"><img ng-src={{place.media.x2}} class=md-card-image alt={{place.label}}></label><md-card-actions><label for=place{{place.id}} layout=row layout-align="space-between center"><p>{{place.label}}</p><input id=place{{place.id}} type=checkbox ng-model=place.selected checklist-model=selected.places checklist-value=place></label></md-card-actions></md-card></div></div><!-- <div flex></div> --></md-content><md-toolbar><div class=md-toolbar-tools layout-align="end center"><md-button ng-click=app.next() class="continue md-raised" aria-label=Continue ng-disabled="selected.places.length<3">Continue</md-button></div></md-toolbar>');
$templateCache.put("src/SelectingStartEndDirective.html", '<md-content layout=column><md-subheader><h1>Choose the start and end of your walk</h1><p>Select the place where you want to start and another where you want to end</p></md-subheader><header class=layout-padding><h3>Start location</h3></header><div class=places layout=row layout-align="start none" layout-wrap><md-card class=place ng-repeat="place in selected.places" flex=20 ng-class="{selected: selected.start === place.id}"><label for=startPlace{{place.id}} layout=row layout-align="space-between center"><img ng-src={{place.media.x2}} class=md-card-image alt={{place.label}}></label><md-card-actions><label for=startPlace{{place.id}} layout=row layout-align="space-between center"><p>{{place.label}}</p><input id=startPlace{{place.id}} name=startPlace type=radio ng-model=selected.start ng-value=place.id></label></md-card-actions></md-card></div><header class="layout-padding fade" ng-if=selected.start><h3>End location</h3></header><div class="places fade" layout=row layout-align="start none" layout-wrap ng-if=selected.start><md-card class=place ng-repeat="place in selected.places" flex=20 ng-class="{selected: selected.end === place.id}"><label for=endPlace{{place.id}} layout=row layout-align="space-between center"><img ng-src={{place.media.x2}} class=md-card-image alt={{place.label}}></label><md-card-actions><label for=endPlace{{place.id}} layout=row layout-align="space-between center"><p>{{place.label}}</p><input id=endPlace{{place.id}} name=endPlace type=radio ng-model=selected.end ng-value=place.id></label></md-card-actions></md-card></div></md-content><md-toolbar><div class=md-toolbar-tools layout-align="end center"><md-button ng-click=app.next() class="continue md-raised" aria-label=Continue ng-disabled="selected.start===0||selected.end===0">Continue</md-button></div></md-toolbar>');
$templateCache.put("src/Sidebar.html", '<div class=places><h4>Your route</h4><md-card class=place ng-repeat="place in selected.places" ng-click=map.showPlace(place)><label for=place{{place.id}} layout=row layout-align="space-between center"><img ng-src={{place.media.x2}} class=md-card-image alt={{place.label}}></label><md-card-actions><label for=place{{place.id}} layout=row layout-align="space-between center"><p>{{place.label}}</label></md-card-actions></md-card></div><span flex></span><div class=actions layout=column layout-align=center><md-button ng-click=app.next() class="finish md-raised md-primary" aria-label="View step by step direcctions">View step by step directions</md-button></div>');
$templateCache.put("src/StartViewDirective.html", '<div layout=column layout-align="center center"><img class=logo src=assets/img/logo/hi-tec.png alt=Hi-Tec alt=Hi-Tec><h1>Create your own walking route</h1><div flex></div><md-progress-circular ng-if=app.state.isPristine() md-mode=indeterminate md-diameter=40></md-progress-circular><div ng-if=app.state.isReady() class=fade layout-align="center end"><md-button ng-click=app.next() class="start md-raised md-primary" aria-label=Start><md-icon md-svg-icon=place></md-icon>Start</md-button></div></div>');
$templateCache.put("src/StaticMap.html", '<div class=map-placeholder><!-- <img ng-src="{{map.staticMapURL}}" /> --></div><directions ng-cloak></directions><div class=print-actions layout=row><md-button ng-click=static.cancel() aria-label=Cancel>Cancel</md-button><md-button ng-click=static.print() class="cancel md-raised md-primary" aria-label=Print>Print</md-button></div>') }]);