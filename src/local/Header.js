import { Link } from 'react-router-dom';

const Header = ({backDrop}) => {
  return (
    <header>
      <h1 className="clickable">
        <Link className="headerText" to=".." relative="path">Paul and Kyle's <wbr />horror movie list</Link>
      </h1>
    </header>
  )
}

export default Header;
