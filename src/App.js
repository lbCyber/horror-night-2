import './styles/app.scss'
import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CSSTransition } from 'react-transition-group'
import Swal from 'sweetalert2';
import axios from 'axios';
import Footer from './local/Footer'
import Header from './local/Header'
import Languages from './json/languages'
import Movie from './local/Movie'
import MovieCard from './local/MovieCard'

const App = () => {

  const [apiData, setApiData] = useState([]),
        [languages, setLanguages] = useState(Languages),
        [back, setBack] = useState(null),
        [backFadeOut, setBackFadeOut] = useState(false),
        [review, setReview] = useState({}),
        [moviePick, setMoviePick] = useState(null),
        [page, setPage] = useState(1);


  const warningFire = useCallback((warning) => {
    Swal.fire({
      title: 'Oops!',
      text: warning,
      type: 'error',
      confirmButtonText: 'Okay'
    })
  },[])

  const bgCallBack = useCallback((bg) => {
    if (window.innerWidth > 768) {
      setBack(bg)
      setTimeout(() => {
        setBackFadeOut(false)
      }, 1000)
    }
  },[])

  const simpleBackCB = useCallback((e) => {
    setBack(e)
    setBackFadeOut(false)
  },[])

  const moviePickCB = (e) => {
    setMoviePick(e)
  }

  const pickLanguage = (lang) => {
    //Return true/false if language exists in json file
    const langCompare = (language) => language.iso_639_1 === lang;
    const output = languages.find(langCompare); //Find the language
    return `${output["english_name"]}` //Return English name
  }

  const getList = useCallback((e) => {
    axios({ // Get our local review data
      url: './json/reviews.json',
      method: 'GET',
      dataType: 'json'
    }).then(response => {
      setReview(response.data)
    }).then(() => {
      axios({ // Get themoviedb list
        url: process.env.REACT_APP_LIST_URL,
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.REACT_APP_API_AUTH
        },
        params: {
          language: 'en-US',
          page: page
        }
      }).then(response => {
        setApiData(response.data.items)
      })
    }).catch(error => {  // If nothing matched, something went wrong on your end!
      warningFire(`Something went wrong on our end! Please wait a moment, and try your search again!`)
    })
  },[setReview, setApiData, warningFire, page])

  useEffect(()=>{
    getList();
  },[getList])

  return (
    <Router>
      <CSSTransition
        in={backFadeOut === false}
        timeout={1000}
        classNames="loadBGFade"
        unmountOnExit>
        <div className="backDrop" style={{ backgroundImage: `radial-gradient(transparent, #000), url("${back}")` }}></div>
      </CSSTransition>
      <Header moviePageActive={moviePick === null} callback={moviePickCB} backDrop={bgCallBack} />
      <main>
        <div className="wrapper">
          <Switch>
            {
              apiData.map((movie, key) => {
                return (
                  <Route path={`/${movie.id}`} key={key}>
                    <Movie moviePick={movie} movieReviews={review[movie.id]} callback={moviePickCB} backDrop={simpleBackCB} languages={languages} />
                  </Route>
                )
              })
            }
            <Route path="/">
              <div className="headerBlurb">
                <h4>For every month for over five years, two best friends have gotten together to find a new horror-themed movie to review, with an eye for overlooked gems or overrated trash.</h4>
                <h4>Explore the site to discover movies that might interest you! Everything is rated based on five criteria: Enjoyability, Success, Memorability, Recommendability, and Rewatchability. We'll also provide our post-movie discussion on what we thought of the film.</h4>
              </div>
              <div className="pages">
                {
                  (page > 1) ?
                    <p className="page clickable" onMouseDown={() => {
                      setPage(page - 1)
                      getList()
                    }}>&lt; previous page</p>
                    : (<p className="noclick"></p>)
                }
                {
                  (page < 3) ?
                    <p className="page clickable" onMouseDown={() => {
                      setPage(page + 1)
                      getList()
                    }}>next page &gt;</p>
                    : (<p className="noclick"></p>)
                }
              </div>
              <div className="movieGrid">
                {
                  apiData.map((movie, key) => {
                    return (
                      <MovieCard moviePick={movie} key={key} language={pickLanguage(movie.original_language)} cardNumber={key} ready={backFadeOut === false && back === null} reviewData={review[movie.id]} callback={moviePickCB} backDrop={bgCallBack} />
                    )
                  })
                }
              </div>
              <div className="pages">
                {
                  (page > 1) ?
                    <p className="page clickable" onMouseDown={() => {
                      setPage(page - 1)
                      window.scrollTo(0, 0)
                      getList()
                    }}>&lt; previous page</p>
                    : (<p className="noclick"></p>)
                }
                {
                  (page < 3) ?
                    <p className="page clickable" onMouseDown={() => {
                      setPage(page + 1)
                      window.scrollTo(0, 0)
                      getList()
                    }}>next page &gt;</p>
                    : (<p className="noclick"></p>)
                }
              </div>
            </Route>
          </Switch>
        </div>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
