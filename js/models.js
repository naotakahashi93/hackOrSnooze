"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) { // this is the constructor so any new instance of Story can take in these parameters (storyId, title, author, url, username, createdAt)
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!

    return `${this.url}`;
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, {title, author, url} ) { // this function should take in the user(token), and an object (the story) with the title author and url as the API rules
    // UNIMPLEMENTED: complete this function!
  const token = user.loginToken // we are assigning a variable called token which takes the "user" input which should be the currentUser (which is await User.login or await User.signup) and then takes the loginToken of that user
  
  const storyData = { // creating a variable called storyData which includes the data of the story (title author and url) as required to pass into the post request 
    token, 
    story:{
      title: title,
      author: author,
      url : url
    }
  }
  const result = await axios.post(`${BASE_URL}/stories`, storyData) // getting the result of the post request by passing in the API with the stories endpoint and the data
  console.log("result", result);

  const story = new Story(result.data.story) // creating a variable and assigning it an instance of the Story class which takes in the Story parameters (title author and url)
return story;
}



}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) { // this fucntion allows the user to sign up a new account
    const response = await axios({
      url: `${BASE_URL}/signup`, // we are seding a post request to the signup endpoint and passing in the data username, password, name
      method: "POST",
      data: { user: { username, password, name } },
    }); // this should return a 201 and a token under the data 

    let { user } = response.data

    return new User(  // here we are returning an new instance (an object called User)  for the user that just signd up, an object with the user information and a token.
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) { // the login function takes in a username and password which also returns the token for that existing user
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  } 

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

async addFave(storyId) { //the function for adding a favorite
  const token = this.loginToken  //getting the user token of the logged in user
const result = await axios.post(`${BASE_URL}/users/${this.username}/favorites/${storyId}`, {token: token}) // the add favorite post request reuquires a token and URL that takes in the username and the storyId
  console.log(result);
}

async removeFave(storyId){
  const token = currentUser.loginToken;
  console.log("token", token)
  const result = await axios ({
    url: `${BASE_URL}/users/${this.username}/favorites/${storyId}`,
    method: "DELETE",
    data :{token: token}}) // the add favorite post request reuquires a token and URL that takes in the username and the storyId
 console.log("result", result)
}

}
