import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1 className="clickable" onMouseDown={() => {
        this.props.callback(null)
        this.props.backDrop(null)
      }}>
        <Link class="headerText" to="/">Paul and Kyle's <wbr />horror movie list</Link>
      </h1>
    </header>
  )
}

export default Header;
