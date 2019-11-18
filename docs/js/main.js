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
        for (const i in $scope.tales) {
            console.log(`i: ${i}; tale.id : ${$scope.tales[i].id}`);
            if ($scope.tales[i].id == $scope.id) {
                $scope.tale = $scope.tales[i];
                break;
            }
        }
        // $scope.tale = $scope.tales[$scope.id];
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
        },
        {
            "id" : 4,
            "title" : "La cabra",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale4.png"
        },
        {
            "id" : 5,
            "title" : "La manzanita",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale5.png"
        },
        {
            "id" : 6,
            "title" : "El leon Miguel",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale6.png"
        },
        {
            "id" : 7,
            "title" : "Me asusta la noche",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale7.png"
        },
        {
            "id" : 8,
            "title" : "Que pasa con Papá",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale8.png"
        },
        {
            "id" : 9,
            "title" : "Llegó la comida",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale9.png"
        },
        {
            "id" : 10,
            "title" : "Hay! me caí",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale10.png"
        },
        {
            "id" : 11,
            "title" : "Hay! me caí",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale11.png"
        },
        {
            "id" : 12,
            "title" : "Hay! me caí",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale12.png"
        },
        {
            "id" : 13,
            "title" : "Hay! me caí",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale13.png"
        },
        {
            "id" : 14,
            "title" : "Hay! me caí",
            "author" : "Anónimo",
            "text" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "footer" : "",
            "image" : "tale14.png"
        }

    ];
})