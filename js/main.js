/* global angular */
var headlines = [
  {
    text:'Powerful training tools for professionals looking to improve team efficiency.',
    creator:'Christopher Columbus',
    url:"",
  },
  {
    text:'Concise copy for unique products.',
    creator:'Martin Luther King Jr.',
    url:"",
  },
  {
    text:'State of the art tools for improving your company\'s bottom line.',
    creator:'Cleopatra',
    url:"",
  },
  {
    text:'Software that increases user satisfaction by 100%.',
    creator:'John F. Kennedy',
    url:"",
  },
  {
    text:'Bill your clients with the speed and reliability of a true professional.',
    creator:'Daniel Dafoe',
    url:"",
  },
  {
    text:'Mobile testing tools that put you in control of its success.',
    creator:'Daniel Dafoe',
    url:"",
  },
  {
    text:'Control your e-commerce business from the comfort of your home.',
    creator:'No one famous',
    url:"",
  },
{
    text:'The best place to start thinking of new ideas is outside the realm of what you know is possible.',
    creator:'Wile E. Coyote',
    url:"",
  },
];

var app = angular.module("HeadlineGenerator", ['ngAnimate']);

app.controller("HeadlineController", ['$scope', function($scope) {
  //$scope.headline = "[adjectives] [object] for people looking to [action].";
  $scope.headline = "Welcome, anon. Click Generate to get inspired, or Submit to inspire others.";
  $scope.author = "by Admin";
  $scope.authorLink = "";
  $scope.prevHeadline = -1;
  $scope.numOfVotes = 0;
  $scope.headlineId = "";
  $scope.voteText = "Inspired +1";


  /* 
  ** Call the get_headlines PHP file in order to get all rows
  ** from the database as JSON objects in a PHP associative array.
  ** Parse the data as JSON and generate a random number that will
  ** will be used as the data to use from the backend.
  ** apply() is needed for a single-click on the Generate button
  ** to be effective since Angular needs to know when something
  ** outside of itself is being used.
  --------------------------------------------------------*/
  $scope.generateHeadline = function() {
    // Reset the vote text
    if ($scope.voteText != "Inspired +1") {
      $scope.voteText = "Inspired +1";
    }

    $.ajax({
      type: "GET",
      url: "../php/get_headlines.php",
      success: function(data) {
        //console.log(data);
        var dataArr = JSON.parse(data);
        var random = Math.floor(Math.random() * (dataArr.length - 0)) + 0;

        while (random == $scope.prevHeadline) {
          random = Math.floor(Math.random() * (dataArr.length - 0)) + 0
        }
        //console.log(dataArr[random].id);
        
        // Necessary whenever you do something outside of Angular, e.x., XHR.
        $scope.$apply(function() {
          $scope.headline = dataArr[random].headline;
          $scope.author = "by " + dataArr[random].creator;
          $scope.authorLink = dataArr[random].url;
          $scope.headlineId = dataArr[random].id;
        });

        $scope.getVotes(dataArr[random].id);

        //$scope.numOfVotes = $scope.getVotes(dataArr[random].id);
        //console.log($scope.getVotes(dataArr[random].id));
        
        //console.log(dataArr[random].creator);
        $scope.prevHeadline = random;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  };


  /* 
  ** Make an AJAX request to the PHP file and send the object
  ** containing the submitted data. Automatically generate the
  ** submission date and send that as well. Success will call
  ** the showSuccessAlert() function, whereas an error will
  ** invoke the showError() function.
  --------------------------------------------------------*/
  $scope.postHeadline = function(post) {
    var currTime = new Date();
    currTime = currTime.getDate() + "/" + currTime.getUTCDate() + "/" + currTime.getFullYear();
    
    // Check if the URL entered is a real URL
    //$scope.validateURL(post.url);

    var postData = {
        "headline": post.headline,
        "creator": post.creator,
        "url": post.url,
        "createDate": currTime
    };

    $.ajax({
      type: "POST",
      url: "../php/add_headline.php",
      data: postData,
      success: function(data) {
        console.log(data);

        // Close the submit form and display a success alert.
        $scope.closeSubmit();
        //$scope.showSuccessAlert();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  };

  /* 
  ** Make an AJAX request to the PHP file and send the object
  ** containing the submitted data. Automatically generate the
  ** submission date and send that as well. Success will call
  ** the showSuccessAlert() function, whereas an error will
  ** invoke the showError() function.
  --------------------------------------------------------*/
  $scope.getVotes = function(headlineID) {
    var r = "";
    var hID = {
        "headline_id": headlineID
    };

    $.ajax({
      type: "POST",
      url: "../php/get_votes.php",
      data: hID,
      success: function(d, text, jqXHR) {
        console.log(d);
        //console.log(text);
        //console.log(jqXHR);
        $scope.$apply(function() {
          $scope.numOfVotes = d;
        });
        //return d;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
    //console.log(r);
    //return r;
  };

  /* 
  ** Make an AJAX request to the PHP file and send the object
  ** containing the submitted data. Automatically generate the
  ** submission date and send that as well. Success will call
  ** the showSuccessAlert() function, whereas an error will
  ** invoke the showError() function.
  --------------------------------------------------------*/
  $scope.addVote = function() {
    var voteData = {
        "headline": $scope.headline,
        "creator": $scope.author,
    };

    $.ajax({
      type: "POST",
      url: "../php/add_vote.php",
      data: voteData,
      success: function(data) {
        //console.log(data);

        // Inform the user that their vote was saved.
        //$scope.showSuccessAlert();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });

    // Increase the number of votes displayed as soon as the user votes
    $scope.numOfVotes = parseInt($scope.numOfVotes) + 1;

    $scope.voteText = "Thank you";
  };

  /* 
  ** Ensure that the URL is formed properly. This means
  ** check that it starts with 'http://' or 'http://www',
  ** and that it isn't just text. If it's blank,
  ** submit a 'null' string to the database.
  --------------------------------------------------------*/
  $scope.validateURL = function(url) {

  }

  /* 
  ** Give visibility (and animation) to the success alert
  ** to show the user that their submission was received.
  --------------------------------------------------------*/
  $scope.showSuccessAlert = function() {
    //var alert = document.getElementById('alert');
    //alert.classList.add('alert-in');
  };

  /* 
  ** Close the submission form by removing the previously
  ** appended class .submit-in. Removing pointer events from the
  ** .submit-container is also necessary to allow clicks
  ** on the main .wrapper's child elements.
  --------------------------------------------------------*/
  $scope.closeSubmit = function() {
    document.getElementById('submit').classList.remove('submit-in');
    document.getElementById('submit').children[0].classList.remove('submit-in');
    document.getElementsByClassName('submit-close')[0].classList.remove('submit-in');
    document.getElementsByClassName('submit-container')[0].classList.remove('all-pointer-events');
  };

  /* 
  ** Need to figure out how to stop propogation
  ** so that the submitHeadline() click doesn't bubble
  ** and cause a click on the generateHeadline() as well.
  --------------------------------------------------------*/
  $scope.submitHeadline = function() {
    $scope.clearForm();
    document.getElementById('submit').classList.add('submit-in');
    document.getElementById('submit').children[0].classList.add('submit-in');
    document.getElementsByClassName('submit-close')[0].classList.add('submit-in');
    document.getElementsByClassName('submit-container')[0].classList.add('all-pointer-events');
  };

  /* 
  ** Clear the headline submission form by grabbing the #submit
  ** element and then finding the form child. Then call reset().
  --------------------------------------------------------*/
  $scope.clearForm = function() {
    var form = document.getElementById('submit').getElementsByTagName('form');
    form[0].reset();
  }
}]);