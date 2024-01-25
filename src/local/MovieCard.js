import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from "react-router-dom";

const MovieCard = (props) => {

  const [loaded, setIsLoaded] = useState(false),
        [hover, setIsHovering] = useState(false),
        [paulRank, setPaulRank] = useState(0),
        [kyleRank, setKyleRank] = useState(0);

  useEffect(()=>{
    const reviewsum = (arr) => Object.values(arr).reduce((a, b) => a + b, 0) // Simple adder for paulRank and kyleRank
    setPaulRank(reviewsum(props.reviewData.reviews["Paul"]))
    setKyleRank(reviewsum(props.reviewData.reviews["Kyle"]))

    setTimeout(() => {
      setIsLoaded(true)
    }, props.cardNumber * 75)

    const img = new Image();
    img.src = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${props.moviePick.poster_path}`

  })

  const setBackDrop = (img) => {
    props.backDrop(img)
  }

  const setHover = (s) => {
    setIsHovering(s)
    props.backDrop(null)
  }

  return (
    <React.Fragment>
      <CSSTransition
        in={loaded}
        timeout={100}
        classNames="cardLoadFade">
        <figure className="card" tabIndex={props.cardNumber + 2} id={`card${props.cardNumber}`} onMouseEnter={() => {
          setHover(true)
          setTimeout(() => {
            if (props.ready && hover) {
              setBackDrop(`https://image.tmdb.org/t/p/w1280${props.moviePick.backdrop_path}`)
            }
          }, 1000)
        }} onMouseLeave={() => {
          setHover(false)
        }}>
          <div className="cardTitle">
            {
              // Someone keeps changing the en-US title for Under the Shadow to its persian title, and it really isn't the fight I want to dedicate my life to, so we'll just change it here
            }
            <h4>{(props.moviePick.title === "زیر سایه") ? "Under the Shadow" : `${props.moviePick.title}`}</h4>
            <h5>{`(${props.moviePick.release_date.slice(0, 4)})`}</h5>
          </div>
          <div className="imageContainer">
            <img src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${props.moviePick.poster_path}`} alt={`Movie poster for ${props.moviePick.title}`} />
            <Link to={`/${props.moviePick.id}`}>
              <figcaption onMouseDown={() => {
                props.callback(props.moviePick.id)
              }}>
                <div className="clickReviewBox" >
                  {(paulRank + kyleRank > 5) ?
                    <h4 className="green">{`Rating: ${paulRank + kyleRank}/10`}</h4>
                    : <h4 className="red">{`Rating: ${paulRank + kyleRank}/10`}</h4>
                  }
                  <h5>Click for review</h5>
                </div>
              </figcaption>
            </Link>
          </div>
          <div className="pkRatings">
            {(paulRank > 2) ?
              <h5 className="ratingNumber green">{`Paul: ${paulRank}/5`}</h5>
              : <h5 className="ratingNumber red">{`Paul: ${paulRank}/5`}</h5>}
            {(kyleRank > 2) ?
              <h5 className="ratingNumber green">{`Kyle: ${kyleRank}/5`}</h5>
              : <h5 className="ratingNumber red">{`Kyle: ${kyleRank}/5`}</h5>}
          </div>
          <h6>Language: {props.language}</h6>
          <h6><a href={`https://www.themoviedb.org/movie/${props.moviePick.id}`} target="_blank" rel="noopener noreferrer">TMDB Rating:</a> {props.moviePick.vote_average}/10</h6>
        </figure>
      </CSSTransition>
    </React.Fragment>
  )
}

export default MovieCard;
