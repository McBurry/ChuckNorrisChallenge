# ChuckNorrisChallenge

## Main goals and requirement of the project

Create a JavaScript based Client Application, web or mobile, that utilizes the purpose of the Gateway. If you would like to use a Framework like Vue or React, or WechatMiniApp (prefer) to create your Client Application, feel free to use them but if you do, start a project from scratch and don’t use a 3rd party boilerplate/ starter kit.

## Technologies actually used in the system

* Used EJS for the rendering of pages.
* The client and server side are handled with Node.js
* The database is hosted on a personal MySQL server.
* Some of the direct request made by the user are handled thanks to JQuery and AJAX.
* Account and sessions are implemented in the system.

### Non-functional requirements

* Create and manage the Client application in a GIT-Repo from the start. When committing, please provide a proper description;
* Create small NodeJsApi what will send request to 3rd party API.
* If you did NodeJs Api all requests to external API’s from your Client Application must be routed via the Gateway (NodeJs Api). So, no direct request from your Client Application to external API’s are allowed. You need to create your own API for this on the Gateway. Note: don’t forget to use the logging utility
* When you finished your Client Application, please provide us both your Client Application code and the API-Gateway code Note: If you use a repo, make sure to push the log-files as well.

### Functional requirements - Mandatory

* Fetch 10 Random Chuck Norris jokes from the following API: http://api.icndb.com/jokes/random/10;
* The jokes need to be displayed in a list;
* In this list we can mark certain jokes as favorite. The favorites jokes will appear in a favorites list with a max of 10 (unique) items; (It can be your NodeJs Api as store or Localstorage)
* There should be an option to remove jokes from the favorites list as well;
* On refresh the favorites lists should be maintained, maybe it’s a good idea to use the database and/or caching for this;
* We can turn on/off a timer via a button (every 5 seconds) which will add one random joke to the favorites list that is fetched from http://api.icndb.com/jokes/random/1 until the list has 10 items.

### Optional

1.	Create a login page that will log you in via the JWT-functionality of the APIGateway;
2.	Store the JWT-Token in the browser;
3.	If a valid JWT-Token is stored in the browser, auto-login the user;
4.	Display only the stored jokes & favorites for the logged in user;
5.	The login form should consist of a username/email field (both can be used to login at the login API) and password which must comply to the following password security requirements:
* Passwords must include one increasing straight of at least three letters, like ‘abc’, ‘cde’, ‘fgh’, and so on, up to ‘xyz’.
* They cannot skip letters so e.g. ‘acd’ doesn't count.
* Passwords may not contain the letters i, O, or l, as these letters can be mistaken for other characters and are therefore confusing.
* Passwords must contain at least two non-overlapping pairs of letters, like aa, bb, or cc.
* Passwords cannot be longer than 32 characters.
