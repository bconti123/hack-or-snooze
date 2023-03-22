"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelBtn = false) {
console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDelBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : "" }
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// delete button HTML
function getDeleteBtnHTML() {
  return `
        <span class="trash-can">
          <i class="fas fa-trash-alt"></i>
        </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function SubmitForm(e) {
  e.preventDefault();
  // gather input values from submit form.
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();
  const StoryData = {title, author, url };
  
  // Submit form to addStory.
  const story = await storyList.addStory(currentUser, StoryData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // reset it
  $submitForm.slide("slow");
  $submitForm.trigger("reset");
}
$submitForm.on("submit", SubmitForm);

// List of user's own stories

function putUserStoriesOnPage() {
  console.debug("PutUserStoriesOnPage");

  $ownStoriesList.empty();

  if(currentUser.ownStories.length === 0) {
    $ownStoriesList.append("<h5>No stories added by user yet!</h5>");
  }
  else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStoriesList.append($story);
    }
  }

  $ownStoriesList.show();
}

// handle deleting a story

async function deleteStory(e) {
  console.debug("deleteStory");

  const $closestLi = $(e.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putStoriesOnPage();

}

$ownStoriesList.on("click", ".trash-can", deleteStory);

// Make favorite/non-favorite star for story

function getStarHTML(story, user) {
  const isFavor = user.isFavorites(story);
  const starType = isFavor ? "fas" : "far";
  return `
        <span class="star">
          <i class="${starType} fa-star"></i>
        </span>`;
}

// function for favorites list

function FavoritesListOnPage() {
  console.debug("FavoritesListOnPage");
  
  $allFavoredList.empty();

  if (currentUser.favorites.length === 0) {
    $allFavoredList.append("<h5>No Favorities added</h5>");
  }
  else {
    // Loop through all of users favorites and generate HTML.
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $allFavoredList.append($story);
    }
  }

  $allFavoredList.show();

}

// handle favorite/unfavorite a story

async function toggleStoryFavorites(e) {
  console.debug("toggleStoryFavorites");

  const $target = $(e.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // to see if the item is already favored (check star)
  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
  else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesList.on("click", ".star", toggleStoryFavorites);