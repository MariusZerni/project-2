# movies

## ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)  General Assembly, Software Engineering Immersive
# Movify
### by [Lucy Maitland](https://github.com/lucymait) and [Marius Zerni](https://github.com/MariusZerni)

![Welcome Page](..src/images/Homepage.png)

## Overview

Movify was my second project, with General Assembly, during the software engineering immersive course. Marius and I had to build a multi-page React web app, that consumes a public API within a mini 48 hour hackathon.

Deliberation didn't take long, as we knew straight away which external API we wanted to use. As we both have a passion for movies, The Movie Database API was the perfect fit.

We built an app, where users can:
- View a list of any Movie
- Search for any Movie and view details on that specific Movie
- View a list of the Top Rated Movies

Want to find a great Movie to watch? Please feel free to check out Movify [here](https://lucymait.github.io/project-2/).

## Brief

- **Consume a public API** – this could be anything but it must make sense for your project.
- **Have several components** - At least one classical and one functional.
- **The app should include a router** - with several "pages".
- **Include wireframes** - that you designed before building the app.
- Have **semantically clean HTML** 
- **Be deployed online** and accessible to the public.


## Technologies Used

- JavaScript (ES6)
- React.js
- HTML, JSX
- The Movie Database API
- Axios
- Webpack
- Git and GitHub
- CSS
- Bulma

## Approach

The first steps, involved thorough planning, so we knew which features we wanted to add before any start to the code:

- A home page
- A navbar
- A movies page where users can search for any Movie (from the database) using the Searchbar, as well as use pagination.
- A single movie page
- Top Rated Movies page where users can scroll through the page to see the most recent top rated movies. 

The routing of our app is:

- The home page at path "/"
- The Movies page at path "discover/movie"
- The Single Movie page at path "/movie/:id"
- The Top Rates Movies page at path "movie/top_rated"

## Navbar

We've created the navbar in order to navigate on the website. We've created 3 links :'Home', 'Movies' and 'Top Rated', each one is directing the user to the selected link. 

Also we've created the logic for the navbar to be fixed when the page is scrolled.
In the NavBar object' state we've set a property 'scrolled' with the initial value of 'false'. Then in componentDidMount we've added an EventListener on 'scroll' that is checking if the vertical scroll location is less than 100 then it updates the scrolled state to be 'true' and this will trigger the display of the navbar class 'scrolled'.


```js
import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
class NavBar extends React.Component {
  constructor() {
    super()
    this.state = {
      scrolled: false
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', () => {
      const isTop = window.scrollY < 100
      if (isTop !== true) {
        this.setState({ scrolled: true })
      } else {
        this.setState({ scrolled: false })
      }
    })
  }
  render() {
    return <nav className={this.state.scrolled ? 'nav scrolled' : 'nav'}>
      <div className="logo">
        <img className="logo-img" src="images/logo.png" alt="logo" />
      </div>
      <div className="navbar-text">
        <div className="nav-link">
          <Link to="/">Home</Link>
        </div>
        <div className="nav-link">
          <Link to="/discover/movie">Movies</Link>
        </div>
        <div className="nav-link">
          <Link to="/movie/top_rated">Top Rated</Link>
        </div>
      </div>
    </nav>
  }
}
export default withRouter(NavBar)
```

## Movies Page

After reading the documentation for our external API (The Movie Database) and receiving our API Key, we next studied the data in Insomnia so we can see how the API is laid out.

As you can see from Insomnia, the data we wanted to fetch was results which gave us an array of objects which was the Single Movie.

A challenge we came across was that the API only gave us 1 page of Movies per request. Therefore in order to retrieve all the movies we needed a search bar and pagination.

In our state we added:
- Movies (as null), 
- Page (as a number, 1)
- totalPages (as null)
- filteredMovies (as an empty array)
- query (as an empty string)

![Insomnia](/Images/Insomnia.png)

``` js
    this.state = {
      movies: null,
      page: 1,
      totalPages: null,
      filteredMovies: [],
      query: ''
    }
```

Next, we created a function **fetchAllMovies(page), to get our data through using axios (which we had to install as a dependency). We got the endpoint from the documentation, which illustrated that we had to add our API Key in the url (as seen below), to enable authorization. 

We made a get requst to call to the API and fetch the Movies page and the Movie poster image. 

This function also set everything that is in state once we have the response.data.

``` js
  fetchAllMovies(page) {
      axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=6ab51da28effd684f4d12eaf8d20b33c&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`)
        .then(response => {
          const movieImage = response.data.results
          movieImage.forEach(elem => {
            elem.imageUrl = 'https://image.tmdb.org/t/p/w500/' + elem.poster_path
          })
          this.setState({
            movies: response.data,
            filteredMovies: response.data,
            query: '',
            totalPages: parseInt(response.data.total_pages),
            page: parseInt(response.data.page)
          })
        })
  }
```

The **fetchMoviesBySearchQuery(searchQuery)** function makes another get request to our API for when we search for the Movies in the Search Form. Once we had the SearchQuery and filterdMovies, we had to set this in state (as seen below).

``` js
 fetchMoviesBySearchQuery(searchQuery) {
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=6ab51da28effd684f4d12eaf8d20b33c&query=${searchQuery}`)
      .then(response => {
        const movieImage = response.data.results
        movieImage.forEach(elem => {
          elem.imageUrl = 'https://image.tmdb.org/t/p/w500/' + elem.poster_path
        })
        this.setState({
          query: searchQuery,
          filteredMovies: response.data.results
        })
      })
  }
```

The **filterMovies(event)** function, contained an if statement which checked whether the fetchMoviesBySearchQuery was being used, if not fetchAllMovies.

``` js
  filterMovies(event) {
    const searchQuery = event.target.value
    if (searchQuery) {
      this.fetchMoviesBySearchQuery(searchQuery)
    } else {
      this.fetchAllMovies()
    }
  }
```

Finally our render method, firstly returned our SearchForm which checked query and onChange. 

Next we mapped through the results array and returned our Movie Card component. This displayed a card with the Movie Image, Rating and Release Date. 

if anything was typed in the searchForm, the filterMovies function was called. We mapped through the filteredMovies and returned the MovieCard of the filtered Movie. 

``` js
<SearchForm query={this.state.query} onChange={() => this.filterMovies(event)} />
              <div className='columns is-multiline is-mobile'>
                {!this.state.query ? this.state.movies.results.map((movies, i) => {
                  return <MovieCard
                    key={i}
                    id={movies.id}
                    title={movies.title}
                    imageUrl={movies.imageUrl}
                    description={movies.overview}
                    releaseDate={movies.release_date}
                    voteAverage={movies.vote_average} />
                })
                  :
                  this.state.filteredMovies.map((movies, i) => {
                    return <MovieCard
                      key={i}
                      id={movies.id}
                      title={movies.title}
                      imageUrl={movies.imageUrl}
                      description={movies.overview}
                      releaseDate={movies.release_date}
                      voteAverage={movies.vote_average} />
                  })
                }
```

An animation was added to the card, when on hover, the card flipped, to display the title. 

![Animation](/Images/Animation.png)

## Pagination

![Pagination](/Images/Pages.png)

As we're fetching around 5000 movies from the TMDb API, we had to implement pagination in order to be able to display all the movies. The API is offering an endpoint to retrieve 20 movies per page and it allows to specify a page number. In order for our pagination to work we created some logic so that whenever the user is pressing next or previous buttons, the API call will fetch the right page.
This snippet is fetching a single page. In the URL we are setting a page variable which is the page selected by the user in the UI.
```js
  fetchAllMovies(page) {
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=6ab51da28effd684f4d12eaf8d20b33c&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`)
      .then(response => {
        const movieImage = response.data.results
        movieImage.forEach(elem => {
          elem.imageUrl = 'https://image.tmdb.org/t/p/w500/' + elem.poster_path
        }
        )
        this.setState({
          movies: response.data,
          filteredMovies: response.data,
          query: '',
          totalPages: parseInt(response.data.total_pages),
          page: parseInt(response.data.page)
        })
      })
      .catch(error => console.error(error))
  }
```
We're using Bulma library to display it
```js
import React from  'react'
const Pagination = ({ totalPages, handleClick, handlePreviousClick, handleNextClick, page }) => {
  return (
    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
      <a onClick={handlePreviousClick} className="pagination-previous">Previous</a>
      <a onClick={handleNextClick} className="pagination-next">Next page</a>
      <ul className="pagination-list">
        <li><a onClick={handleClick} className="pagination-link" aria-label="Goto page 1">1</a></li>
        <li><span className="pagination-ellipsis">&hellip;</span></li>
        <li><a onClick={handleClick} className="pagination-link" aria-label="Goto page 45">100</a></li>
        <li><a onClick={handleClick} className="pagination-link" aria-label="Page 46" aria-current="page">200</a></li>
        <li><a onClick={handleClick} className="pagination-link" aria-label="Goto page 47">300</a></li>
        <li><span className="pagination-ellipsis">&hellip;</span></li>
        <li><a onClick={handleClick} className="pagination-link" aria-label="Goto page 86">{totalPages}</a></li>
      </ul>
    </nav>
  )
}
export default Pagination
```
On the UI the user is able to input a specific page number as well and we're fetching the corresponding page from the API:
```js
  handleClick(event) {
    this.fetchAllMovies(event.target.innerHTML)
  }
```
Here is a function that manages the next button click. Every time the user is clicking on the next page we're incrementing the page number.
This function is getting the value fron the state and it is storing it in the new variable ```js const currentPage``` and also we're checking if ```js currentPage``` is equal to ```js totalPages``` to stop when the user clicked on the last page.
```js
  handleNextClick() {
    const currentPage = this.state.page
    if (currentPage === this.state.totalPages) {
      return
    }
    this.fetchAllMovies(currentPage + 1)
  }
```
This code is simillar to the one from above the only differenceis that now we need to decrement the page number in order to display the previous page. Here we're checking if  ```js currentPage``` has reached the first page.
```js
  handlePreviousClick() {
    const currentPage = this.state.page
    if (currentPage === 1) {
      return
    }
    this.fetchAllMovies(currentPage - 1)
  }
```

## Single Movie Page

Clicking on an the Rating, of an individual Movie card, takes the user to that specific single Movie page. E.g: the endpoint /movie/496243 (this would be the single movie page for the movie with the id 496243, which is Parasite).

The Single Movie page displays all the information for that selected movie e.g. **Description, Vote Count, Revenue, Runtime and Vote Average.** To do this we passed the selected drink's ID to the page through the URL and did an axios.get request to the end point with the ID (see details below). Our axios request was in a componentDidMount function which made the request straight away once the user clicked on the Movie Card. The request checks if the id is the same as the id of the props (which have been passed down).

``` js
 componentDidMount() {
    const id = this.props.match.params.id
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=e79232e0769deab0fb7d2a75a986d143`)
      .then(resp => {
        console.log(resp.data)
        this.setState({ movie: resp.data })
      })
      .catch(err => console.error(err))
  }
```
Once we have made the request, in our render method we can return the single movie (which is in our state) and all the information for that selected movie.

Each Movie in our API came with a backdrop_path which was an image we could have in the background of the Single Movie Page. This image is usually a scene from the Movie which gives the user a great taste of what they can experience.
``` js
render() {
    return <section className="hero" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${this.state.movie.backdrop_path})`, backgroundSize: 'cover' }} >
      <div className="columns">
        <div className="column is-one-half">
          <h1 className="title">{this.state.movie.title}</h1>
          <p>{this.state.movie.overview}</p> <br />
          <p>Release Date: {this.state.movie.release_date}</p>
          <p>Vote Count: {this.state.movie.vote_count}</p>
          <p>Vote Average: ⭐️{this.state.movie.vote_average}</p>
          <p>Revenue: £{this.state.movie.revenue}</p>
          <p>Runtime: {this.state.movie.runtime} minutes</p>
        </div>
        <div className="column is-one-half">
          <img className="movie-image" src={`https://image.tmdb.org/t/p/w500/${this.state.movie.poster_path}`}></img>
        </div>
      </div>
    </section>
  }
```

## Top Rated Movies Page

We have also created a Top Rated page for users to easily access the top rated movies. TMDb is giving us an endpoint for the top rated movies and we are fetching data as well via Axios library.
```js
import React from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
import SearchForm from './SearchForm'
import Spinner from './Spinner'
class TopRated extends React.Component {
  constructor() {
    super()
    this.state = {
      movies: null,
      filteredMovies: '',
      query: ''
    }
  }
  componentDidMount() {
    setTimeout(() => {
      axios.get('https://api.themoviedb.org/3/movie/top_rated?api_key=e79232e0769deab0fb7d2a75a986d143&language=en-US&page=1')
        .then(response => {
          const movieImage = response.data.results
          movieImage.forEach(elem => {
            elem.imageUrl = 'https://image.tmdb.org/t/p/w500/' + elem.poster_path
          }
          )
          this.setState({
            movies: response.data,
            filteredMovies: response.data
          })
        }
        )
        .catch(error => console.error(error))
    }, 3000)
  }
```
As we only had a limited amount of time, for now we are only fetching the first page of the Top Rated movies. We are planning to add more improvements: adding logic to display all the Top Rated movies using pagination, design improvements . 


## Spinner

We added a GIF of a Movie reel to act like a spinner on both the Movies Page and Top Rated Movies Page. This spinner was put in a setTimeout so it would display for 3 seconds when the page loads.

![Spinner](/Images/Spinner.png)


## Screenshots

### Homepage 
![Welcome Page](/Images/Homepage.png)

### Movies Page
![Movies Page](/Images/Movies.png)

### Single Movies Page
![Single Page](/Images/Single.png)

### Top Rated Movies
![Top Rated Page](/Images/TopRated.png)

## Challenges
- With this project I had two main challenges. Creating the logic for pagination was a bit tricky. In order to make that work I had to make a dynamic query to the API and also because it was my first project working with an external API, I had to do a lot of documentation which was time consuming. My second challenge was getting a fully functional app using an external API in only two days. 

## Wins 
- After creating this project I felt more confident in understanding and using external APIs. With this project I learned how to create a fully functional app using React with all the dependencies which helped me create a strong foundation on what is happening under the hood. Another win was to be able to have a product to present after only 2 days.

## Potential future features

- Add other endpoints from the API e.g. Now Playing, Popular and Upcoming Movies
- Add a carousel feature
- Add trailers (video feature)

## Lessons learned

- The structure of the API can make a huge difference on the number of steps you need to take to get all the information you want! Planning is key and using insomnia first so you can see how the API is laid out.



