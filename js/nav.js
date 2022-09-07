"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  rememberFave();
}

function newStoryForm() { // the function that is called when we click on the "add new story" anchor. 
    // console.log("newStoryForm", evt);
    hidePageComponents(); // first we call the hidePageComponents (defined in main.js) which hides all the components in the page
    $("#newStoryForm").show(); // then we show the newStoryForm (defined in index.html) to reveal the form to add new story
    rememberFave();
}

function faveStoryPage(){ // this function is called when we click on the Your favorites list link
  hidePageComponents(); // it hides all the components of the page
  $("#newStoryForm").hide(); // and also hides the new story form we just created
  putFaveStoriesOnPage(); // then we call the putFaveStoriesOnPage function (defined in stories.js) which loops through the favories array and creates the story mark up and displays it nicely
  rememberFave();
}


function myStoryPage(){ // this function is called when we click on the Your favorites list link
  hidePageComponents(); // it hides all the components of the page
  $("#newStoryForm").hide(); // and also hides the new story form we just created
  putMyStoriesOnPage(); // then we call the putFaveStoriesOnPage function (defined in stories.js) which loops through the favories array and creates the story mark up and displays it nicely
  rememberFave();
}
$navLogin.on("click", navLoginClick);


$("#newStoryNav").on("click", newStoryForm); //taking the #newStoryNav id from the anchor tag in the html file and adding an event listener when clicked on we are calling newStoryForm
$("#faveNav").on("click", faveStoryPage)
$("#myStoryNav").on("click", myStoryPage)

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  rememberFave();
  $navUserProfile.text(`${currentUser.username}`).show();
}
