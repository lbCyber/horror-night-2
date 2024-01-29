import { useEffect, useState } from 'react';
import axios from 'axios';
import nl2br from 'react-newline-to-break';
import { Link } from "react-router-dom";

const Movie = ({moviePick, movieReviews, backDrop, languages}) => {

  const [language, setLanguage] = useState(""),
        [video, setVideo] = useState(""),
        [hover, setHover] = useState(null),
        [hoverReviewer, setHoverReviewer] = useState(null)

  useEffect(()=>{
    backDrop(`https://image.tmdb.org/t/p/w1280${moviePick.backdrop_path}`)
    // Please random user, stop changing the language for one movie to Persian in en-US
    const langCompare = (language) => language.iso_639_1 === moviePick.original_language;
    const output = languages.find(langCompare);
    setLanguage(output["english_name"])

    axios({
      url: `https://api.themoviedb.org/3/movie/${moviePick.id}/videos`,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: process.env.REACT_APP_API_AUTH },
      language: `"${moviePick.original_language}"`
    }).then(response => {
      const findYouTube = (v) => (v.site === "YouTube" && v.type === "Trailer")
      const youTubeTrailer = response.data.results.find(findYouTube)

      if (youTubeTrailer.key === "6qCqrODw1nM") { // Babysitter default vid is... uh...
        setVideo("CQTEUd-5JMQ")
      } else {
        setVideo(youTubeTrailer.key)
      }
    })
  },[moviePick, languages])

  const blurbHover = (c, r = null) => {
    setHover(reviewBlurb[c])
    setHoverReviewer(r)
  }

  const reviewBlurb = [
    {
      criteria: "Enjoyable",
      criteriaShort: "enjoyable",
      keyName: "Enjoyable",
      heading: "Enjoyable",
      blurb: `The simplest criteria there is: Did we like watching it? \n\nAn "enjoyable" rating means we enjoyed the overall experience the film offered. Even if the ending somehow sucked, it was still a good ride.`
    },
    {
      criteria: "Succeeds at what it intends to do",
      criteriaShort: "successful",
      keyName: "Successful",
      heading: "Successful",
      blurb: `A little more nuanced than the rest of the criteria: Was what the film tried to do or be clear, and did it succeed in doing or being that thing?\n\nA successful film doesn't have to be ambitious. Even a barebones slasher fic is a success if it can be a slasher fic without at any point falling flat.`
    },
    {
      criteria: "Memorable",
      criteriaShort: "memorable",
      keyName: "Memorable",
      heading: "Memorable",
      blurb: `A film can do everything right, and it can be absolutely enjoyable from beginning to end... but how much of an impact does it have on its audience?\n\nThis is more or less a test of the film's ambition. How unique was it? How much of it can we actually remember after seeing it?\n\nA memorable film is one that for any reason has staying power.`
    },
    {
      criteria: "Easy to recommend",
      criteriaShort: "easy to recommend",
      keyName: "Recommendable",
      heading: "Recommended",
      blurb: `A movie that's easy to recommend is one with at least somewhat of a strong sense of appeal to a general audience.\n\nHow comfortable would we be recommending this film to other friends? How sure are we that they'd like it, instead of it being a little too niche?`
    },
    {
      criteria: "Rewatchable",
      criteriaShort: "rewatchable",
      keyName: "Rewatchable",
      heading: "Rewatchable",
      blurb: `A little self-explanatory. A rewatchable film is one we'd have no qualms about watching again. Or maybe we've already watched it hundreds of times and are still good for another.\n\nNote: A film can still be good even if it isn't considered rewatchable. Some are even fantastic, but are so neatly-wrapped up that there wouldn't be much to gain from watching it again.`
    },
  ]

  const returnBlurb = (p) => {
    const criteria = reviewBlurb.map(i=>({
        criteria: i.criteriaShort,
        Criteria: i.heading,
        yesno: movieReviews.reviews[p][i.keyName]
    }))
    return criteria.map((i,k)=>(
      <li onMouseOver={() => { blurbHover(k, p) }} onMouseLeave={() => { blurbHover(null) }}>
        {(i.yesno) ? <img src="./assets/yes.png" alt={`${p} found the movie ${i.criteria}`} /> : <img src="./assets/no.png" alt={`${p} didn't find the movie ${i.criteria}`} />}
        <h6>{i.Criteria}</h6>
      </li>
    ))
  }

  return (
    <article className="moviePage">
      <div>
        <p onMouseUp={(e) => {
          if (e.button === 0) {
            backDrop(null, true)
          }}}>
          <Link className="goBack clickable" to="/" relative="path">&gt; Return to the main menu</Link>
        </p>
      </div>
      <section className="moviePageInfo">
        <h2>{(moviePick.title === "زیر سایه") ? "Under the Shadow" : `${moviePick.title}`} ({moviePick.release_date.slice(0, 4)})</h2>
        <div className="movieInfoContainer">
          <img className="moviePagePoster" src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${moviePick.poster_path}`} alt={`Movie poster for ${moviePick.title}`} />
          <div className="trailer">
            <iframe className="trailerFrame" title={`Trailer for ${moviePick.title}`} src={`https://www.youtube-nocookie.com/embed/${video}`} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} modestbranding="true"></iframe>
          </div>
          <div className="deetTopInfo movieDeets">
            <p><span className="deetHeader">Language: </span> {language}</p>
            <p><span className="deetHeader"><a href={`https://www.themoviedb.org/movie/${moviePick.id}`} target="_blank" rel="noopener noreferrer">TMDB Rating:</a> </span> {moviePick.vote_average} ({moviePick.vote_count} votes)</p>
          </div>
          <div className="movieOverview movieDeets"><p className="deetHeader overviewHeader">Overview: </p> <p className="overviewText">{moviePick.overview}</p></div>
        </div>
      </section>
      <section className="pkReviews">
        <div className="reviewChart">
          <div className="movieReviewChart">
            <h4>Paul:</h4>
            <ul>
              {returnBlurb("Paul")}
            </ul>
          </div>
          <div className="movieReviewChart">
            <h4>Kyle:</h4>
            <ul>
              {returnBlurb("Kyle")}
            </ul>
          </div>
        </div>
        <div className="reviewToolTip">
          {(hover !== null && hover !== undefined) ?
            <div className="reviewToolTipContent hoverToolTip" aria-hidden>
              <h5>{hover["criteria"]}</h5>
              <p>{nl2br(hover["blurb"])}</p>
              {(movieReviews.reviews[hoverReviewer][hover["keyName"]]) ?
                <p className="green">{hoverReviewer} found {moviePick.title} {hover["criteriaShort"]}</p>
                : <p className="red">{hoverReviewer} did not find {moviePick.title} {hover["criteriaShort"]}</p>
              }
            </div>
            : null}
          <div className="reviewToolTipContent noHoverToolTip">
            <h2 className="legend">Legend</h2>
            {reviewBlurb.map((movieCriteria, key) => {
              return (
                <div className="noHoverCriteria" key={key}>
                  <h4>{movieCriteria["criteria"]}</h4>
                  <p>{nl2br(movieCriteria["blurb"])}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <div>
        <p onMouseUp={(e) => {
          if (e.button === 0) {
            backDrop(null, true)
          }}}>
          <Link className="goBack clickable" to="/" relative="path">&gt; Return to the main menu</Link>
        </p>
      </div>
    </article>
  )
}

export default Movie;
