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
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navSubmit.show(); 
  $navFavorite.show();
  $navOwnStories.show();
  $navLeft.show();
}

// Nav to Submit Form handle click
function navSubmitForm(e) {
  console.debug("navSubmitFormClick");
  hidePageComponents();
  $allStoriesList.show();
  $submitSection.show();
}

$navSubmit.on("click", navSubmitForm);

// Nav to Favorite List Handle Click. Show Favorite List
function navFavoriteClick(e) {
  console.debug("NavFavoritesClick", e);
  hidePageComponents();
  FavoritesListOnPage();
}

$navFavorite.on("click", navFavoriteClick);

function navOwnStoriesClick (e) {
  console.debug("NavOwnStoriesClick", e);
  hidePageComponents();
  putUserStoriesOnPage();
  
}

$navOwnStories.on("click", navOwnStoriesClick);