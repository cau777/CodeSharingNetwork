# CodeSharingNetwork

A platform that allows users to write and post snippets different languages with a simple code editor, like other
snippets, and follow other users. It was inspired by Twitter and GitHub, and made using React, Typescript, ASP .Net Core
and Entity Framework.

## Features

- Dark theme user interface using React
    - Home page
    - Post Snippet
    - Settings
    - User profile
    - Login
    - Registration
- Authentication using JWT Bearer
- Interactive registration form with username and password requirements
- Code Snippets
    - Title, description, language, and author
    - Python integration to find keywords of the snippet's description (adapted version of my other
      project [Key-Terms-Extractor](https://github.com/cau777/Key-Terms-Extractor))
- Code Editor based on JetBrains Rider
    - Syntax highlighting of keywords and literals
    - Inline and Multiline comments
    - Auto indent
    - Auto insert some characters ("()", "{}", "[]")
    - Supports Java, C#, Javascript, Typescript, Python
- User Profiles
    - User image upload with Crop & Resize
    - Bio and real name
- Ability to see others' profiles and follow them
- Recommendation system that generates a score for snippets considering date and and whether it was posted by following
  users
- Searchbar to search for users and snippets
    - Also searches for snippet's keywords
- Auto logging of every request

## Installation

1) Create a virtual environment on Api/Python
2) Install the requirements using pip
3) Build and run the C# API
4) Run client with the command "npm start"

## Screenshots
- ![Home Page](https://github.com/cau777/CodeSharingNetwork/blob/master/Screenshots/Home.png)
- ![Post Snippet Page](https://github.com/cau777/CodeSharingNetwork/blob/master/Screenshots/PostSnippet.png)
- ![Profile Page](https://github.com/cau777/CodeSharingNetwork/blob/master/Screenshots/Profile.png)
