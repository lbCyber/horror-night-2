const Footer = () => {
  let d = new Date();
  return (
    <footer>
      <p>Horror Night / Lintbox - © <a href="mailto:paul@lintbox.com">Paul R.</a> - {d.getFullYear()}</p>
    </footer>
  )
}

export default Footer
