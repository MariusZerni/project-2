# movies

## Pagination

As we're fetching around 5000 movies from the TMDb API, we had to implement pagination in order to be able to display all the movies. The API is offering an endpoint to retrive 20 movies per page and it allows to specify a page number. In order for our pagination to work we created some logic so that whenever the user is pressing next or previous buttons, the API call will fetch the right page.



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

## Navbar

We've created the navbar in order to navigate on the website. We've created 3 links :'Home', 'Movies' and 'Top Rated', each one is directing the user to the selected link. Also we've created the logic for the navbar to be fixed when the page is scrolled.

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

## Top Rated

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