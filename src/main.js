var items = [];
var guessed = true;
var score = 0;
var TEST = [["a",1],["b",2],["c",3],["d",4],["e",5],["f",6],["g",7],["h",8]];
var LISTING = {};
var DUPLICATE_LISTING = {};
var IMAGE_ID = 0;

// chosen from top posts in last month from these
var SUBREDDITS = ["woahdude","aww","nevertellmetheodds","mildlyinteresting","iamverysmart","2meirl4meirl",
  	"insanepeoplefacebook","therewasanattempt","mildlyinfuriating","coaxedintoasnafu","madlads","crappydesign","thisismylifenow",
    "PeopleFuckingDying","youdontsurf","cringepics","iamverybadass","quityourbullshit","oopsdidntmeanto","comedycemetery","deepfriedmemes",
    "murderedbywords","oldpeoplefacebook","indianpeoplefacebook","wholesomememes","justneckbeardthings","dontdeadopeninside","thathappened",
    "maliciouscompliance","hmmm","atbge"];

function init() {
  //while (true) {
    //if (guessed) {
      getContent();
    //}
  //}
}

function getContent() {
  guessed = false;
  promise = fetchContent(SUBREDDITS[Math.floor(Math.random()*SUBREDDITS.length)]).then(function(value) {
    LISTING = value.data.children;
    //console.log(LISTING);
  }, function(reason) {
    console.log(reason);
  });

  huh = [];
  huh.push(promise);

  Promise.all(huh).then(function() {
    LISTING = filterDomains(LISTING);
    if (LISTING.length!=0) {
      picked = Math.floor((Math.random() * LISTING.length));
      pickedData = LISTING[picked].data;
      document.getElementById("image").innerHTML = "<img src=\""+pickedData.url+"\" style=\"max-height:400px; max-width:auto;\"/>";
      IMAGE_ID = pickedData.id;
      setContent();
    } else {
      guessed = true;
      alert("oops couldn't find anything");
      setTimeout(function() {
        getContent();
      },2000);
    }
  });
}

function setContent() {
  duplicatePromise = fetchDuplicates(IMAGE_ID).then(function(value) {
    DUPLICATE_LISTING = value[0].data.children.concat(value[1].data.children);
    console.log(DUPLICATE_LISTING);
  }, function(reason) {
    console.log(reason);
  });

  huh = [];
  huh.push(duplicatePromise);

  Promise.all(huh).then(function() {
    items = [];
    for (i=0; i<DUPLICATE_LISTING.length; i++) {
      if (DUPLICATE_LISTING[i].data.score>100)
        items.push(DUPLICATE_LISTING[i].data.subreddit);
      document.getElementById("answers").innerHTML = "???";
    }
  });
}

function textSubmit(e) {
  if (event.key === 'Enter') {
    guess();
  }
}

function guess() {
  input = document.getElementById("guess").value;
  for (i=0; i<items.length; i++) {
    if (items[i].toUpperCase()===input.toUpperCase() && !guessed) {
      document.getElementById("answers").innerHTML = "/r/"+items[i];
      guessed = true;
      score++;
      document.getElementById("score").innerHTML = score;
      break;
    }
  }
  document.getElementById("guess").value = "";
  if (guessed)
  setTimeout(function() {
    getContent();
  },2000);
}
