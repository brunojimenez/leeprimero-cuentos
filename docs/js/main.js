var app = angular.module('app', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "pages/home.html", 
            controller: "homeCtrl"
        })
        .when("/sharephoto", {
            templateUrl : "pages/sharephoto.html",
            controller: "sharephotoCtrl"
        });

});

app.controller('homeCtrl', function($scope, $rootScope, $routeParams, $interval, $location){
    console.log("[homeCtrl] start");
    
    $scope.id = $routeParams.id;

    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    var width = 320; // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
    var streaming = false;
    var video = null;
    var canvas = null;

    $scope.goto = function(to) {
        console.log("[homeCtrl] goto: " +  to);
        $location.path(to);
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
    $scope.takepicture = async function() {
        console.log("[homeCtrl] takepicture");
        var context = canvas.getContext('2d');

        // Flip horizontal
        

        if (width && height) {
            canvas.width = width;
            canvas.height = height;

            $rootScope.width = width;
            $rootScope.height = height;

            console.log("[homeCtrl] drawImage1");
            await context.drawImage(video, 0, 0, width, height);
            $rootScope.photo = await canvas.toDataURL();       
        }
    }

    $scope.doCountDown = function() {
        console.log("[homeCtrl] countDown!");
        $scope.countDown = 2 ; // Seconds to coundown
        $scope.interval = $interval(async function(){
            console.log("[homeCtrl] countDown: ", $scope.countDown--);
            if ($scope.countDown == 0) {
                console.log("[homeCtrl] countDown stop!");
                await $scope.takepicture();
                await $interval.cancel($scope.interval);
                await $location.path('/sharephoto');
                await $scope.$apply();
            }
        },1000,0);
    }

    $scope.init = function() {
        console.log("init");
        
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');

        navigator.mediaDevices.getUserMedia({
                video: true , // { width: { min: 320 }, }  // { width: 1280, height: 720 }
                audio: false
            })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("[homeCtrl] An error occurred: " + err);
            });
        
        video.addEventListener('canplay', function(ev) {
            if (!streaming) {
                console.log("[homeCtrl][addEventListener canplay] !streaming");

                console.log("[homeCtrl][addEventListener canplay] video.videoWidth : ", video.videoWidth);
                console.log("[homeCtrl][addEventListener canplay] video.videoHeight : ", video.videoHeight);

                height = video.videoHeight / (video.videoWidth / width);

                console.log("[homeCtrl][addEventListener canplay] height : ", height);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.
                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                console.log("[homeCtrl][addEventListener canplay] height : ", height);

                video.setAttribute('width', width);
                video.setAttribute('height', height);

                streaming = true;
            }
        }, false);
    };
    $scope.init();

    $scope.$on("$destroy", function() {
        console.log("[homeCtrl] destroy");
        try {
            video.srcObject.getTracks().forEach(function(track) {
                track.stop();
            });
        } catch (ex) {
            console.log("[homeCtrl] destroy", ex);
        }
    });
});

app.controller('sharephotoCtrl', function($scope, $rootScope, $routeParams, $location){
    console.log("[sharephotoCtrl] start");

    $scope.canvas = null; 

    $scope.init = function() {
        console.log("[sharephotoCtrl] init");
        $scope.canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
               
        /*
        var imageObj1 = new Image();
        imageObj1.src = $rootScope.photo;
        */

        // draw image
        var imageObj1 = document.getElementById('photo');
        if ($rootScope.photo) {
            imageObj1.setAttribute('src', $rootScope.photo);
        } else {
            imageObj1.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII');
        }

        imageObj1.onload = function() {
            $scope.canvas.width = photo.width;
            $scope.canvas.height = photo.height;
            context.drawImage(photo, 0, 0, imageObj1.width, imageObj1.height);
            // context.translate(width, 0);
            // context.scale(-1, 1);
        }

        var imageObj2 = new Image();
        imageObj2.src = "images/001 Cuento - Mono photo0.png";
        imageObj2.onload = function() {
            context.drawImage(imageObj2, 0, 0, imageObj1.width, imageObj1.height);      
        }
    }
    $scope.init();

    $scope.goto = function(to) {
        console.log("[sharephotoCtrl] goto: " +  to);
        $location.path(to);
    }

    $scope.download = function() {
        console.log("[sharephotoCtrl] download");
        var downloadLink = document.createElement("a");
        downloadLink.href = $scope.canvas.toDataURL();
        downloadLink.download = "foto.png";
        downloadLink.click();
    }

    $scope.$on("$destroy", function() {
        console.log("[sharephotoCtrl] destroy");
        $rootScope.photo = null;
    });
});

app.run(function($rootScope) {
    $rootScope.tales = [
        {
            "id" : 1,
            "title" : "Anoche cuando dormía",
            "author" : "Antonio Machado",
            "text" : "Anoche cuando dormía, soñé ¡bendita ilusión! que una colmena tenía dentro de mi corazón; y las doradas abejas iban dabricando en él, con las amarguras viejas, blanca cera y dulce miel.",
            "footer" : "(fragmento)",
            "image" : "tale1.png"
        },
        {
            "id" : 2,
            "title" : "La lechuza",
            "author" : "Aramis Quintero",
            "text" : " En la noche oscura va una mano blanca. Guante de la luna. Pañuelo o bufanda. Nadie lo adivina... Vuela silenciosa, y de pronto grazna.",
            "footer" : "(fragmento)",
            "image" : "tale2.png"
        },
        {
            "id" : 3,
            "title" : "El burro enfermo",
            "author" : "Anónimo",
            "text" : "A mi burro, a mi burro... ",
            "footer" : "",
            "image" : "tale3.png"
        }
    ];
})