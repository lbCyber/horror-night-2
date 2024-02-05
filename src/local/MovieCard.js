import {
  useState,
  useEffect } from 'react';
import { Link } from "react-router-dom";

const MovieCard = ({moviePick, language, cardNumber, reviewData}) => {

  const [loaded, setIsLoaded] = useState(false),
        [paulRank, setPaulRank] = useState(0),
        [kyleRank, setKyleRank] = useState(0)

  const mobileCheck = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

  useEffect(()=>{
    const reviewsum = (arr) => Object.values(arr).reduce((a, b) => a + b, 0)
    setPaulRank(reviewsum(reviewData.reviews["Paul"]))
    setKyleRank(reviewsum(reviewData.reviews["Kyle"]))
    setTimeout(() => {
      setIsLoaded(true)
    }, cardNumber * 75)
  },[cardNumber, reviewData, moviePick])

  return (
    <>
      <figure
        className={`card${loaded ? " cardFadeIn" : ""}`}
        tabIndex={cardNumber + 2}
        id={`card${cardNumber}`}>
        <div className="cardTitle">
          {
            // Someone keeps changing the en-US title for Under the Shadow to its persian title, and it really isn't the fight I want to dedicate my life to, so we'll just change it here
          }
          <h4>{(moviePick.title === "زیر سایه") ? "Under the Shadow" : `${moviePick.title}`}</h4>
          <h5>{`(${moviePick.release_date.slice(0, 4)})`}</h5>
        </div>
        <div className="imageContainer">
          <img
            src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${moviePick.poster_path}`}
            alt={`Movie poster for ${moviePick.title}`} />
          <Link
            to={`/${moviePick.id}`}
            onMouseUp={(e)=>{
              if (e.button === 0) {
                window.scrollTo(0, 0)
              }}}>
            <figcaption>
              <div className="clickReviewBox" >
                {(paulRank + kyleRank > 5) ?
                  <h4 className="green">{`Rating: ${paulRank + kyleRank}/10`}</h4> :
                  <h4 className="red">{`Rating: ${paulRank + kyleRank}/10`}</h4>
                }
                <h5>{mobileCheck ? "Tap" : "Click"} for review</h5>
              </div>
            </figcaption>
          </Link>
        </div>
        <div className="pkRatings">
          {
            (paulRank > 2) ?
              <h5 className="ratingNumber green">{`Paul: ${paulRank}/5`}</h5> :
              <h5 className="ratingNumber red">{`Paul: ${paulRank}/5`}</h5>
          }
          {
            (kyleRank > 2) ?
              <h5 className="ratingNumber green">{`Kyle: ${kyleRank}/5`}</h5> :
              <h5 className="ratingNumber red">{`Kyle: ${kyleRank}/5`}</h5>
          }
        </div>
        <h6>Language: {language}</h6>
        <h6>
          <a
            href={`https://www.themoviedb.org/movie/${moviePick.id}`}
            target="_blank"
            rel="noopener noreferrer">
            TMDB Rating:
          </a>
          {` ${moviePick.vote_average.toFixed(1)}/10 `}
        </h6>
      </figure>
    </>
  )
}

export default MovieCard;
