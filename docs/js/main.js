var app = angular.module('app', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "pages/home.html", 
            controller: "homeCtrl"
        })
        .when("/tale/:id", {
            templateUrl : "pages/tale.html",
            controller: "taleCtrl"
        })
        .when("/photo/:id", {
            templateUrl : "pages/photo.html",
            controller: "photoCtrl"
        });

});

app.controller('homeCtrl', function($scope, $rootScope){
    console.log("homeCtrl");

    $scope.tales = $rootScope.tales;

    $scope.init = function() {
        
    }
    $scope.init();

});

app.controller('taleCtrl', function($scope, $rootScope, $routeParams){
    console.log("taleCtrl");

    $scope.id = $routeParams.id;
    $scope.tales = $rootScope.tales;
    
    $scope.init = function() {
        $scope.tale = $scope.tales[$scope.id];
    }
    $scope.init();
});

app.controller('photoCtrl', function($scope){
    console.log("photoCtrl");

    $scope.photodata = "";

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
    var photo = null;

    // Fill the photo with an indication that none has been
    // captured.
    $scope.clearphoto = function() {
        console.log("clearphoto");

        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Fill photo
        var data = canvas.toDataURL('image/png');
        console.log("clearphoto data: ", data);
    
        photo.setAttribute('src', data);
        $scope.photodata = "";
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
    $scope.takepicture = function() {
        console.log("takepicture");

        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');

            console.log("takepicture data: ", data);
            photo.setAttribute('src', data);
            $scope.photodata = data;
        } else {
            $scope.clearphoto();
        }
    }

    $scope.init = function() {
        console.log("init");
        
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        
        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });
        
        video.addEventListener('canplay', function(ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);
                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.
                if (isNaN(height)) {
                    height = width / (4 / 3);
                }
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

    };
    $scope.init();

    $scope.clearphoto();
});


app.run(function($rootScope) {
    $rootScope.tales = [
        {
            "id" : 1,
            "title" : "Anoche cuando dormía",
            "author" : "Antonio Machado",
            "text" : "Anoche cuando dormía, soñé ¡bendita ilusión! que una colmena tenía dentro de mi corazón; y las doradas abejas iban dabricando en él, con las amarguras viejas, blanca cera y dulce miel.",
            "footer" : "(fragmento)" 
        },
        {
            "id" : 2,
            "title" : "La lechuza",
            "text" : "..."
        },
        {
            "id" : 3,
            "title" : "El mono Jacobo",
            "text" : "..."
        },
        {
            "id" : 4,
            "title" : "La cabra",
            "text" : "..."
        },
        {
            "id" : 5,
            "title" : "La manzanita",
            "text" : "..."
        },
        {
            "id" : 6,
            "title" : "El leon Miguel",
            "text" : "..."
        },
        {
            "id" : 7,
            "title" : "Me asusta la noche",
            "text" : "..."
        },
        {
            "id" : 8,
            "title" : "Que pasa con Papá",
            "text" : "..."
        },
        {
            "id" : 9,
            "title" : "Llegó la comida",
            "text" : "..."
        },
        {
            "id" : 10,
            "title" : "Hay! me caí",
            "text" : "..."
        },
        {
            "id" : 11,
            "title" : "Hay! me caí",
            "text" : "..."
        },
        {
            "id" : 12,
            "title" : "Hay! me caí",
            "text" : "..."
        },
        {
            "id" : 13,
            "title" : "Hay! me caí",
            "text" : "..."
        },
        {
            "id" : 14,
            "title" : "Hay! me caí",
            "text" : "..."
        },
        {
            "id" : 15,
            "title" : "Hay! me caí",
            "text" : "..."
        },
        {
            "id" : 16,
            "title" : "Hay! me caí",
            "text" : "..."
        }

    ];
})