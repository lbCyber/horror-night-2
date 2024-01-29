const Footer = () => {
  let d = new Date();
  return (
    <footer>
      <p>Horror Night (Powered by <a href="https://www.themoviedb.org" rel="noopener noreferrer">theMovieDB.org</a>) / <a href="http://paulroc.ca" target="_blank" rel="noopener noreferrer">Lintbox</a> - © <a href="mailto:paul@lintbox.com">Paul R.</a> - {d.getFullYear()}</p>
    </footer>
  )
}

export default Footer
