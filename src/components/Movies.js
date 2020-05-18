import React from 'react'
import axios from 'axios'

import MovieCard from './MovieCard'
import SearchForm from './SearchForm'
import Pagination from './Pagination'
import Spinner from './Spinner'

class MoviesIndex extends React.Component {
  constructor() {
    super()

    this.state = {
      movies: null,
      page: 1,
      totalPages: null,
      filteredMovies: [],
      query: ''
    }
  }

  fetchAllMovies(page) {
    // setTimeout(() => {
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
    // }, 3000)
  }


  componentDidMount() {

    this.fetchAllMovies()

  }


  fetchMoviesBySearchQuery(searchQuery) {
    console.log('fetching')

    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=6ab51da28effd684f4d12eaf8d20b33c&query=${searchQuery}`)
      .then(response => {
        const movieImage = response.data.results
        movieImage.forEach(elem => {
          elem.imageUrl = 'https://image.tmdb.org/t/p/w500/' + elem.poster_path

        }
        )
        this.setState({
          query: searchQuery,
          filteredMovies: response.data.results

        })

      })
  }



  filterMovies(event) {

    const searchQuery = event.target.value

    if (searchQuery) {
      this.fetchMoviesBySearchQuery(searchQuery)
    } else {
      this.fetchAllMovies()
    }

  }

  handleClick(event) {
    // console.log(event.target.innerHTML)
    this.fetchAllMovies(event.target.innerHTML)
  }

  handleNextClick() {

    const currentPage = this.state.page
    if (currentPage === this.state.totalPages) {
      return
    }
    this.fetchAllMovies(currentPage + 1)
  }

  handlePreviousClick() {
    const currentPage = this.state.page

    if (currentPage === 1) {
      return
    }
    // console.log(currentPage)
    this.fetchAllMovies(currentPage - 1)
    // console.log(this.fetchAllMovies())
  }


  render() {


    if (!this.state.movies)
      return <Spinner
      />
    else
      return (<>
        <SearchForm query={this.state.query} onChange={() => this.filterMovies(event)} />
        <section className="FilmsIndex">
          <div className='section'>
            <div className='container'>
              <div className='columns is-multiline is-mobile'>
                {!this.state.query ? this.state.movies.results.map((movies, i) => {
                  return <MovieCard
                    key={i}
                    id={movies.id}
                    // title={movies.title}
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
                      // title={movies.title}
                      imageUrl={movies.imageUrl}
                      description={movies.overview}
                      releaseDate={movies.release_date}
                      voteAverage={movies.vote_average} />
                  })
                }

              </div>
            </div>
          </div>
        </section>
        <div>
          <Pagination
            totalPages={this.state.totalPages}
            handleClick={(event) => this.handleClick(event)}
            handleNextClick={() => this.handleNextClick()}
            handlePreviousClick={() => this.handlePreviousClick()}
            page={this.state.page}
          />
        </div>
      </>
      )
  }

}

export default MoviesIndex
