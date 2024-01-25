import { Link } from 'react-router-dom';

const Header = ({callback, backDrop}) => {
  return (
    <header>
      <h1 className="clickable" onMouseDown={() => {
        callback(null)
        backDrop(null)
      }}>
        <Link className="headerText" to="/">Paul and Kyle's <wbr />horror movie list</Link>
      </h1>
    </header>
  )
}

export default Header;
