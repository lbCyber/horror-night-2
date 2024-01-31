import './styles/app.scss';
import {
  useEffect,
  useState,
  useCallback,
  useRef } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Outlet } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import Footer from './local/Footer';
import Header from './local/Header';
import Languages from './json/languages';
import LoadingModal from './local/Loading';
import Movie from './local/Movie';
import MovieCard from './local/MovieCard';

const App = () => {

  const [apiData, setApiData] = useState([]),
        [languages] = useState(Languages),
        [review, setReview] = useState({}),
        [back, setBack] = useState(null),
        [isLoading, setIsLoading] = useState(true),
        pageTotal = useRef(0),
        page = useRef(1)


  const warningFire = useCallback((warning) => {
    Swal.fire({
      title: 'Oops!',
      text: warning,
      type: 'error',
      confirmButtonText: 'Okay'
    })
  },[])

  const simpleBackCB = (bg) => {
    setTimeout(()=>{
      setBack(bg)
    }, 10)
  }

  const pickLanguage = (lang) => {
    //Return true/false if language exists in json file
    const langCompare = (language) => language.iso_639_1 === lang,
          output = languages.find(langCompare); //Find the language
    return `${output["english_name"]}` //Return English name
  }

  const getList = useCallback((page) => {
    setIsLoading(true)
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
          page: page.current
        }
      }).then(response => {
        pageTotal.current = response.data.total_pages
        setApiData(response.data.items)
      }).finally(()=>{
        setIsLoading(false)
      })
    }).catch(error => {  // If nothing matched, something went wrong on your end!
      warningFire(`Something went wrong on our end! Please wait a moment, and try your search again!`)
    })
  },[setReview, setApiData, warningFire])

  useEffect(()=>{
    getList(page.current);
  },[getList, page])

  const IndexContent = () => {
    return (
      <>
        <div
          className="backDrop"
          style={{
            backgroundImage: `radial-gradient(transparent, #000), url("${back}")`
          }}></div>
        <Header />
        { isLoading ? <LoadingModal /> : null }
        <main>
          <div className="wrapper">
            <Outlet />
          </div>
        </main>
      </>
    )
  }

  const MovieGrid = () => {
    simpleBackCB(null)

    const pageNav = () => {
      const prevValid = (page.current > 1),
            nextValid = (page.current < pageTotal.current),
            prevPage = !prevValid ? "" : "< previous page",
            nextPage = !nextValid ? "" : "next page >"
      const clickAction = (activate, val = 0) => {
        if (activate) {
          page.current = page.current + val
          window.scrollTo(0, 0)
          setApiData([])
          getList(page)
        }
      }
      return (
        <>
          <p
            className={`page${(prevPage !== "") ? " clickable" : " noClick"}`}
            onMouseUp={(e) => {
              if (e.button === 0) {
                clickAction(prevValid, -1)
              }}}>
            { prevPage }
          </p>
          <p
            className={`page${(nextPage !== "") ? " clickable" : " noClick"}`}
            onMouseUp={(e) => {
              if (e.button === 0) {
                clickAction(nextValid, 1)
              }}}>
            { nextPage }
          </p>
        </>
      )
    }

    return (
      <>
        <div className="headerBlurb">
          <h4>For every month for over five years, two best friends have gotten together to find a new horror-themed movie to review, with an eye for overlooked gems or overrated trash.</h4>
          <h4>Explore the site to discover movies that might interest you! Everything is rated based on five criteria: Enjoyability, Success, Memorability, Recommendability, and Rewatchability. We'll also provide our post-movie discussion on what we thought of the film.</h4>
        </div>
        <div className="pages">
          { pageNav() }
        </div>
        <div className="movieGrid">
          {
            apiData.map((movie, key) => {
              return (
                <MovieCard
                  moviePick={movie}
                  key={key}
                  language={pickLanguage(movie.original_language)}
                  cardNumber={key}
                  reviewData={review[movie.id]} />
              )
            })
          }
        </div>
        <div className="pages">
          { pageNav() }
        </div>
      </>
    )
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<IndexContent />}>
          <Route index element={<MovieGrid />} />
          {
            apiData.map((movie, key) => {
              return (
                <Route
                  path={`/${movie.id}`}
                  key={key}
                  element={
                    <Movie
                      moviePick={movie}
                      movieReviews={review[movie.id]}
                      backDrop={simpleBackCB}
                      languages={languages} />
                  } />
              )
            })
          }
        </Route>
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;
