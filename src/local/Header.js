import { Link } from 'react-router-dom';

const Header = ({backDrop}) => {
  return (
    <header>
      <h1 className="clickable" onMouseDown={(e) => {
        if (e.button === 0) {
          backDrop(null)
        }}}>
        <Link className="headerText" to="/">Paul and Kyle's <wbr />horror movie list</Link>
      </h1>
    </header>
  )
}

export default Header;
