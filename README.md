# GA Software Engineering Immersive: Project 3

# FactFlow App

**Context:** Misinformation is a big problem and we often concentrate our fighting efforts on stopping the spread of fake news but there are [some researches](https://misinforeview.hks.harvard.edu/wp-content/uploads/2022/01/acerbi_fighting_misinformation_20220112.pdf) that indicate that interventions aimed at reducing acceptance or spread of fake news are bound to have very small effects on the overall quality of the information environment, especially compared to interventions aimed
at increasing trust in reliable news sources.

**What:** This app is an attempt at a reliable News Aggregator, powered by [Perigon Contextual Intelligence APIs](https://www.goperigon.com/) for gathering Articles and Stories Clusters and [Google Gemini GenAI API](https://ai.google.dev/tutorials/setup) for Fact Checking. It has its own backend infrastructure to maintain authentication and database management in MongoDB.

## Technologies Used

![MongoDB](/public/mongoDB.png)
![Express](/public/express.png)
![React](/public/react.png)
![Node.js](/public/node.js.png)
![JS](/public/js.png)
![HTML5](/public/html5.png)
![CSS](/public/css.png)
![npm](/public/npm.png)
![Material UI](/public/material_ui.png)

## Getting Started

### Postman Collection

We created and exported a Postman collection with all the endpoints we created on the backend so you can run to check registration, login and Smart Collections (Stories) CRUD, along with seeds to facilitate testing.
Export from here and import in Postman: [FactFlow Postman Collection](/public/FactFlow.postman_collection.json)

![Postman_Env](/public/postman_environment.png)

**NOTE:** Make sure you create a separate postman environment (like in the picture above) so you can include your access_token and refresh_token, that will be inherited by the requests in your collection.

### Backend Configuration

- Go to the project backend folder and create a new package.json file

  `npm init -y`

- Install the packages:

  `npm i dotenv express-validator mongoose jsonwebtoken bcrypt uuid cors helmet express-rate-limit`

  - **dotenv:** A package used to load environment variables from a .env file into process.env.
  - **Express-validator:** A set of middleware functions to validate input data in Express.js applications.
  - **mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a straight-forward, schema-based solution to model application data.
  - **Jsonwebtoken:** A library to create and verify JSON Web Tokens (JWT) for secure communication between parties.
  - **bcrypt:** A library to help hash passwords securely.
  - **Uuid:** A package to generate universally unique identifiers (UUIDs).
  - **Cors:** A package to enable CORS (Cross-Origin Resource Sharing) in Express.js applications, allowing controlled access to resources from other domains.
  - **Helmet:** A package to secure Express.js apps by setting various HTTP headers.
  - **Express-rate-limit:** A middleware to limit repeated requests to your API to protect against abuse and improve stability.

- Create your .env and add the database path (like below for localhost)

  `DATABASE=mongodb://127.0.0.1:27017/factflow`

  `ACCESS_SECRET=<YOUR_ACCESS_SECRET>`

  `REFRESH_SECRET=<YOUR_REFRESH_SECRET>`

  **NOTE:** We've generated our ACCESS and REFRESH secrets using https://www.random.org/strings/

### Frontend Configuration

- Get your API keys by creating an account at:
  - Perigon API https://www.goperigon.com/
  - Gemini API https://ai.google.dev/tutorials/setup
- Create .env file and add the following (double check Gemini and Perigon's website for the latest URL/version):

  `VITE_PERIGON_ARTICLES_URL=https://api.goperigon.com/v1/all`

  `VITE_PERIGON_STORIES_URL=https://api.goperigon.com/v1/stories/all`

  `VITE_PERIGON_API_KEY=<YOUR_API_KEY>`

  `VITE_GEMINI_KEY=<YOUR_API_KEY>`

  `VITE_SERVER=http://localhost:5002`

- Install the packages:

  - Go to the project frontend folder and install react-app:
    `npm i`

  - Install react-router-dom:
    `npm install react-router-dom`

  - Install react-pro-sidebar:
    `npm install react-pro-sidebar`

  - Install Material UI:
    `npm install @mui/material @emotion/react @emotion/styled`

  - Install Material UI Icons:
    `npm install @mui/icons-material`

  - Install Material UI Date picker:
    `npm install @mui/x-date-pickers`

  - Install Material UI 'dayjs':
    `npm install dayjs`

  - Install Google Gemini:
    `npm install @google/generative-ai`

  - Install jwt-decode:
    `npm i jwt-decode`

  **NOTE:** If you run into dependency errors just run:
  `npm config set legacy-peer-deps true`

## Features

### Login & Registration

![registration_login](/public/registration_login.gif)

### Overall Layout & Articles Display

![layout](/public/layout.gif)

### FactCheck

![factCheck](/public/factCheck.gif)

### Smart Collections & Stories

![stories](/public/stories.gif)

## Architecture

### Backend

#### Login and Registration feature summary

The Register Controller manages user registration by securely storing hashed passwords and usernames in the Auth collection of MongoDB, after validating the registration data. On the other hand, the Login Controller authenticates users by verifying their credentials against the MongoDB data. Upon successful authentication, it issues a JWT access token, enabling authorized access to protected routes.

#### Controllers

##### Auth Controllers

- **seedUsers** this controller seeds the database with dummy user data for testing purposes
- **register** this controller creates new entry in the Auth Schema, it requires a firstName, lastName, password, role fields. The password field is encrypted using bcrypt and the role field defaults to "user" if nothing is submitted for it
- **login** this controller request a email and password field than check both fields against the database. Once verified a access code and refresh code is generated using JWT (JSON web token). The user id is also sent back as part of the response
- **refresh** this controller request a refresh token and once the refresh token is recieved and verified, sends a newly signed access token in a response
- **update** receive an id from params and using the data from in the body, updates the user that the id references
- **getAllAuth** fetches all the auth collection from mongoDB
- **seedSmartCollection** this controller seeds the database with dummy Smart Collection data for testing purposes
- **getAllSmartCollections** fetches all the Smart Collection entries from mongoDB
- **addSmartCollection** add a new Smart Collection into the database with a reference to Auth
- **patchSmartCollection** update a new Smart Collection into the database with a reference to Auth
- **deleteSmartCollection** delete a new Smart Collection into the database with a reference to Auth
- **getCollectionByUserID** fetches all Smart Collection entries from the database (for the currently logged-in user) with a reference to Auth

#### Middleware

- **AuthAdmin & AuthUser** For our middleware we made use of two functions, authUser and authAdmin to protect our routes. The purpose of these functions are to authenticate users based on a JWT (JSON web token) in the authorization header, then depending if the users are authorized, they are either allow proceed to the next function or return an error response. The authAdmin function also check if the user has an "admin" role before allowing the user to proceed.

#### Models

- **Auth Schema** Our first schema is an Auth Schema which contains all our user information, including firstName, lastName, email, hash (our encrypted password), and a role field that references the role schema to determine the appropriate user role. The password is stored securely using bcrypt.
- **Role Schema** The Role Schema consists of a single field, "role," which defines the user's role within the system. This schema is referenced by the Auth Schema to assign the appropriate role to each user.
- **SmartCollection Schema** This schema stores the user's input and passes it on to the frontend as part of our API request, as a search parameter.

#### Routers

##### Auth Routers

- **PUT/register** Runs the register controller, it uses validators (validateRegister) that forces the user to enter an email and enter a password between 8 and 50 characters
- **POST/login** Runs the login controller, it uses validators that makes sure the email and password field are not empty
- **POST/refresh** Runs the refresh controller, it is protected by the authUser middleware and has validators to make sure a refresh token is submitted
- **GET/seed** Seeds the database with dummy user data. This route is used for testing purposes or populating initial data.
- **GET/allUser** Runs the allUser controller and retrieves all users. Requires admin authentication as it is protected by the authAdmin middleware. Authenticates the user as an admin, and then retrieves all user data
- **PATCH/update/:id** This route receives and id as an parameter and updates the user that the id references using our update controller. Requires admin authentication as it is protected by the authAdmin middleware.

##### SmartCollection Routers

- **GET/api/seed** Seeds the database with dummy smartCollection data. This route is used for testing purposes or populating initial data.
- **GET/api** Runs the getAllSmartCollection controller
- **PUT/api/:id** Runs the addSmartCollection controller, it uses the validateIdInParam and validateAddSmartCollectionData.
- **PATCH/api/:id** Runs the patchSmartCollection controller, it uses the validateIdInParam, validateUpdateSmartCollectionData.
- **DELETE/api/:id** Runs the deleteSmartCollection controller, it uses the validateIdInParam to validate as well.
- **GET/api/:id** Runs the getCollectionByUserID controller, using validateIdInParam to ensure that the collection is added to the user that is currently logged in.

#### Validators

##### Auth Validators

- **validateRegister** A validator that prevents the email field from being empty and password field to have at least 8 - 50 characters
- **validateLogin** A validator that prevents the email and password field from being empty
- **validateRefresh** A validator that make sure a refresh token is submitted

##### SmartCollection Validators

- **validateIdInParam** A validator ensures that the id is not empty when passed as through as a parameter, and has at least 24 characters
- **validateIdInBody** A validator ensures that the id is not empty when passed as through in the body, and has at least 24 characters
- **validateAddSmartCollectionData** A validator that prevents the q parameter from being empty to have at least 1 - 30 characters
- **validateUpdateSmartCollectionData** A validator that prevents the q parameter from being empty to have at least 1 - 30 characters

### Frontend

#### Authentication

- **Login & Registration:** The Login modal component serves dual purposes, offering both login and registration input fields. It leverages Material UI's consistent styling for these input templates, ensuring a seamless user experience. The component accepts a handleClose handler prop from the NavBar to manage modal visibility. It dynamically renders either the login or registration screen based on user interaction, maintaining a cohesive design and flow.

#### Overall Layout

- **Layout 'wrapper':** The Layout component wraps around the navbar, sidebar, and routes to ensure a consistent structure across all pages. It takes child components as input to display alongside the sidebar, rendering the navbar and sidebar together with the provided child component.
- **Navbar:** The function defines a navigation bar component that displays an app logo, a login or logout button based on user authentication status, and allows opening a login modal or logging out. It uses UserContext to manage user data and authentication. The component can be rendered on the webpage and includes documentation links for reference.
- **Sidebar:** The component serves as the main sidebar navigation for the app, offering navigation options for various categories like finance, sports, and entertainment. It includes a personalized feed section for logged-in users to manage their smart collections. Utilizing UserContext, it accesses user data and employs the useFetch hook to fetch API data. While it doesn't return a direct value, it renders a sidebar UI with navigation options and a feed section, allowing users to navigate to different routes based on their selections.
- **Pages:** The Feed page component combines SmartCollection and DisplayStories components, displaying a personalized feed section alongside a list of stories. On the other hand, the Main page component integrates SearchBar and DisplayArticles, featuring a search bar to input search terms and a display area for articles fetched based on those terms. Both components encapsulate related functionalities for a cohesive user experience.

#### Custom Hooks

- **'Backend' API:** useFetch custom hook to fetch article data from Perigon API based on provided parameters. It allows for tailored API calls, leveraging props providing a fetchData function encapsulating the return value from the API call.. Input / Parameters:
  - endpoint: Backend endpoint for the specific fetch.
  - method: HTTP method (e.g., POST, GET, PUT, DELETE).
  - body: Request body for the API call.
  - token: Token required for authentication/login.
- **Perigon Articles API:** useGetArticles custom hook is tailored to fetch and organize articles based on specified search parameters, ensuring accurate retrieval through diverse filters like query, country, source group, category, topic, date range, and sorting criteria. The hook manages loading states, error handling, and dynamically updates the number of results and articles. API Documentation: [Perigon All News API](https://docs.goperigon.com/reference/all-news)
- **Perigon Stories API:** useGetStories custom hook fetches story data from the Perigon API using dynamically passed parameters to customize API calls. It ensures stories are fetched exclusively upon search query changes, while also managing loading states, error handling, and result counts accordingly. API Documentation: [Perigon Stories API](https://docs.goperigon.com/reference/stories-1)
- **Google GenAI API:** useFactCheck custom hook leverages Google's generative AI to fact-check articles while adhering to predefined safety settings to mitigate harmful content risks. The hook takes an article string as input, requests a fact-check analysis from the generative model, and fetches the resulting fact-checked data. For its operation, it mandates an article string as input and yields an object with three properties upon completion:
  - loading: A boolean indicating the ongoing status of the fact-check process.
  - result: The textual outcome of the fact-check, representing the validated article.
  - error: Any error messages encountered during the fact-checking procedure.

#### Display

- **Search bar:** SearchBar component crafts a versatile search bar for the application, empowering users to input search terms and refine their queries using filters like country, source, category, topic, date range, and sorting options. It also integrates advanced search capabilities, expandable to offer more filters. While it doesn't require external props, it internally manages various states including search input, dropdown selections for country and source, checkboxes for categories and topics, date range selection, sorting options, and refinement checkboxes for reprint, paywall, and exclusion labels. When activated, the search button directs users to the main page with passed search parameters as state, facilitating the fetching and display of relevant articles.
- **Articles:** DisplayArticles component renders a masonry-style (Material UI) list of articles based on search parameters received from its parent component. Utilizing the 'useGetArticles' hook, it fetches articles and presents them as individual cards with title, description, publication date, source domain, image, and author details. Users can expand cards to read article summaries and access a fact-check modal to verify content accuracy. The component utilizes the 'useLocation' hook from 'react-router-dom' to gather search parameters.
- **Stories:** DisplayStories component showcases a masonry-style (Material UI) list of stories sourced externally. Leveraging the 'useGetStories' hook, it fetches stories based on provided search parameters, presenting each as a card with story name, summary, updated date, sentiment, and key points. Utilizing the 'useLocation' hook from 'react-router-dom', it captures search parameters from parent components to fetch relevant stories. Users can expand these cards to delve into the key points associated with each story.
- **Fact Check:** The FactCheckModal component is designed to present fact-checking results to users in a structured manner. It utilizes the useFactCheck hook to fetch and parse data based on a provided story prop. The component accepts an 'open' prop to control its visibility and an 'onClose' function to handle modal close events. Once loaded, the modal displays the claims, sources, analysis, and bias associated with the story, incorporating a loading indicator during data retrieval.
- **Smart Collections:** SmartCollection component facilitates user management of smart collections, allowing CRUD operations like adding, updating, and deleting collections of stories. It interacts with the backend API using the UserContext for user-specific data and the useFetch hook for API calls. It renders a UI to display and manipulate smart collections, updating data through the getCollectionByUserID function upon successful operations.
- **Smart Collections Update:** The UpdateCollectionModal component focuses on a modal interface for updating existing collections. It utilizes React, MUI (Material-UI), and context to manage UI interactions, data fetching, and state for collection updates. It expects specific input props, including the updated collection, modal data, and functions to control modal visibility and handle updates. Upon successful collection update, the modal closes, and the user's collection data is refreshed.

## Some Interesting stuff...

- **React-Pro-Sidebar:** React-Pro-Sidebar is a React component library designed to simplify the creation of sidebars. It offers a range of customizable sidebar components that can be easily integrated, providing navigation options and organizing content effectively. With features like collapsible menus, nested menu items, and customizable styles, React-Pro-Sidebar enables developers to build intuitive and user-friendly navigation interfaces with ease.
- **Material UI Masonry:** Masonry is a layout grid system commonly used for displaying content in a dynamic and responsive grid arrangement. Unlike traditional grid systems that rely on fixed column structures, Masonry optimizes space by placing items in optimal positions based on available space, resulting in a more fluid and visually appealing layout. It's particularly useful for showcasing content like images or articles where the dimensions can vary. [Learn More](https://mui.com/material-ui/react-masonry/)

## Next Steps

- Forgot my password feature on Login
