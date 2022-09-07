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

function generateStoryMarkup(story, showDelBtn = false ) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        ${showDelBtn ? delBtn() : ""}
        <button id="fave_${story.storyId}" class="favebtn"> favorite this </button> 
        <small class="story-user">posted by ${story.username}</small>
        
      </li>
    `);
  }

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  $("#newStoryForm").hide()
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  rememberFave();
}


$("#postStoryBtn").on("click", async function (){ // adding an event listener on the submit button to post a new story
  await storyList.addStory(currentUser, // using an anon function to post the story to the page by calling the addStory function and passing in the vaues of the form we inputted
    {title: $("#story-title").val(), 
    author: $("#story-author").val(), 
    url: $("#story-URL").val()
  })
  
} 
)



$(document).on("click", ".favebtn" , async function(event){ // a click event listener for when the .favebtn is clicked
  const targetBtn = event.target; // first we assign the event target to tartgetBtn (the favorite this button)
  const btnLi = targetBtn.closest("li"); // we assign the closest li to the favorite this button we clicked
  const btnId = $(btnLi).attr("id"); // we get the id of the li for the button we clicked which is the story id
  console.log("button event", targetBtn, btnLi, btnId );
  $(targetBtn).toggleClass("clicked"); // when we toggle between the class "clicked", when the button is clicked we add class "clicked" and when we take off the "clicked" class

  if ($(targetBtn).hasClass("clicked")){ // if the button is clicked and therefore has the class "clicked"
    $(targetBtn).text("favorited!");
    localStorage.setItem(`fave_${btnId}`, "true") // here we are setting the the clicked button as true into local storage with teh key of fave_ and the storyId (which is the same as btnId)
    await currentUser.addFave(btnId); // we run the function addFave which adds that story to the favorites array in currentUser using the storyId which is the btnId 
  }
  else {
    $(targetBtn).text("favorite this");
    localStorage.setItem(`fave_${btnId}`, "false") // here we are setting the button without the "clicked" class as false into local storage with the key of fave_ and the storyId (which is the same as btnId)
    await currentUser.removeFave(btnId); // and running the removeFave function to remove the favorite if we are unfavoriting it
  }
}
)
     
function delBtn(){ // the function that is used to create the delete button - called for in the generateStoryMarkup when the showDelBtn is true (its only true for ownStories)
    return "<button class='deletebtn'> delete this </button>"; // it returns the string with the new button element
}

function putMyStoriesOnPage(){ // the function we use to take ownStories and add it to the page "My story list"
  $allStoriesList.empty(); 
  if (currentUser){ // when logged in
    for (let myStories of currentUser.ownStories){ // loop over ownStories in currentUser
     const story = generateStoryMarkup(myStories,true) // then we create a markup for this list of stories enabling the delete button and flipping that to true
     $allStoriesList.append(story); // we append those stories to the list
}
}
$allStoriesList.show();// and show the list
}

function putFaveStoriesOnPage() { // repeating the same function from putStoriesOnPage but with just the favorites

  $allStoriesList.empty();
  if(currentUser){

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) { // looping through the favorites list with variable story for each iterable story
    const $story = generateStoryMarkup(story); // creating the markup of each story and assigning it to $story
    $allStoriesList.append($story); // appending the $story to the page 
  }
    
  } 

  $allStoriesList.show();
}



function rememberFave(){ // a function that remembers which ones are already favorited by the user byt retreiving from local storage
// at this point in local storage we have key/value pairs set with fave_${btnId} if they have been clicked on its true, if they have not been clicked on or if you click on again (toggle) it wont state as true
  for (let key in localStorage) { //iterating over each key/value pair (which we call key) in the localStorage
	// console.log("keyyy", key) 
  if (key.startsWith("fave") && localStorage.getItem(`${key}`) === "true"){ // we are checking for the key in local storage that start with fave(so all the applicable buttons) and if that value is true (aka has been clicked on and favorited) - if its true 
		const btnId = $(`#${key}`); // btnId represents the button element that been clicked on (favorited)
    // console.log("fave-btnId", btnId);
		$(btnId).addClass("clicked").text("favorited!"); // then we add the class "clicked" to it which will add it to the fave and will turn it into a red button and the text will change to "favorited!" (in the css the .clicked class will have a background color of red)
	
}
}
}

async function deleteStory(storyId){ // the function to delete your story
  const token = currentUser.loginToken; // assigning the token variable to the user token 
  // console.log("token", token)
  const result = await axios ({ 
    url: `${BASE_URL}/stories/${storyId}`, 
    method: "DELETE",
    data:{token: token}}) // the delete story request reuquires a token and the storyId
//  console.log("result", result)
}

$(document).on("click", ".deletebtn" , async function(event){ // a click event listener for when the .deletebtn is clicked
  const targetBtn = event.target; // first we assign the event target to tartgetBtn (the delete button)
  const btnLi = targetBtn.closest("li"); // we assign the closest li to the favorite this button we clicked
  const btnId = $(btnLi).attr("id"); // we get the id of the li for the button we clicked which is the story id
  console.log("button ID!!" ,btnId );
  $(targetBtn).addClass("deleted"); // then we add the class "deleted" when clicked

  if ($(targetBtn).hasClass("deleted")){ // if the button is clicked and therefore has the class "deleted"
    $(targetBtn).text("deleted!"); // we change the button text to "deleted!"
    await deleteStory(btnId); // we run the function deleteStory which deletes your story 
  }
}
)