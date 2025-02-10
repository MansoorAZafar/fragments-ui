# fragments-ui
The frontend that will consume/use the fragments backend

### Table of Contents

1. Installation & Running
   - Getting the project
   - Running the project
2. Project Structure
3. File Purpose's

## Installation

1. Clone the repository

```bash
git clone https://github.com/MansoorAZafar/fragments-ui.git
```


1.5 Add Environment Variables
- Add a .env file in the root of the project 
   1. API_URL **(Optional)**
      - The url of the fragment API 
   2. OUATH_SIGN_IN_REDIRECT_URL **(Mandatory)** 
      - The URL to redirect the user to after signing in
   3. AWS_COGNITO_POOL_ID **(Mandatory)**
      - The User Pool ID
   4. AWS_COGNITO_CLIENT_ID **(Mandatory)**
      - The ID of the web app for your User Pool


2. Install all dependencies

```bash
npm i
```

### Run the Project
```bash
npm start      # Run the project in production mode
```

## Project Structure

### / ( Root )

This is where all configuration files and directories will exist.

<details>
<summary>Files</summary>
<ul>
    <li>package.json</li>
    <li>package-lock.json</li>
    <li>.gitignore</li>
    <li>.vscode/</li>
    <li>src/</li>
</ul>
</details>


### /src 

This is where all source files will exist.

<details>
<summary>Files</summary>
<ul>
    <li>css/</li>
    <li>js/</li>
    <li>index.html</li>
</ul>
</details>


### /src/css 

This is where all css style files will exist.

<details>
<summary>Files</summary>
<ul>
    <li>style.css</li>
</ul>
</details>



### /src/js

This is where all js functional files will exist.

<details>
<summary>Files</summary>
<ul>
    <li>api.js</li>
    <li>app.js</li>
    <li>auth.js</li>
</ul>
</details>


## Files
   1. Files in src/
   2. Files in src/css
   3. Files in src/js

### src/index.html
- The main of the frontend
- defines the content layout and structure

### src/css/style.css
- Defines the styling of the index.html

### src/js/api.js
- Defines the interaction between this frontend and the backend
- console logs the user after authenticating them

### src/js/app.js
- Defines the interactability between the index.html to amazon cognito and the api
- Defines the interactability between the index.html and the EC2 instance / fragments API
- Displays the username in a div and allows the user to sign in

### src/js/auth.js
- Redirects the user to sign in
- Creates a simple view of the user
- overall, defines authenticating the user
