# What Movie?  🎞️🍿

### Can't decide or agree on what to watch?
Generate a random movie! Can also be based on your filter options on release year, rating and genres.
<br>

**Visit it here**: [What Movie?](https://whatmovieapp.herokuapp.com)

**Designed and developed by**: 👩🏻‍💻[Sara Lotfi](https://github.com/saralotfi)

# Motivation
I wanted to code a personal project to practise what I have been learning while studying React. Every weekend me and my partner watch a movie. Choosing a movie can be difficult and time-consuming, as there is a lot of choice out there. This motivated me to create an easy-to-use app which simplifies the process.

# Tech-stack 
<a href="https://reactjs.org/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/></a><a href="https://rubyonrails.org" target="_blank"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/rails/rails-original-wordmark.svg" alt="rails" width="40" height="40"/></a>  
**Front-end:** React using functional components with the useState, useEffect and useReducer hooks  
**Back-end:** Ruby on Rails  


# How it works
React performs API calls to Rails where http-requests are made to [_The Movie Database_](https://developers.themoviedb.org/3/getting-started/introduction). Since React embeds environment variables such as API keys in the js build code, I chose to do the Movie Database API calls from the back-end instead for security reasons.
