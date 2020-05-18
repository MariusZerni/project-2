import React from 'react'
import { Link } from 'react-router-dom'


const MovieCard = ({ id, title, imageUrl, releaseDate, voteAverage }) => {
  return (
    <div className='column is-fifth desktop is-one-third-tablet is-half-mobile'>
      <Link to={`/movie/${id}`}>
        <div className='card'>
          <div className="card-header">
            <h4 className="card-title">{title}</h4>
          </div>
          <div className='card-image'>
            <figure className='actual-card-image'>
              <img src={imageUrl} alt='' />
            </figure>
            {/* <span className="backText">{title}</span> */}
          </div>
          <div className='card-content'>
            <h4 >Rating: {voteAverage}</h4>
            <h4>{releaseDate}</h4>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard