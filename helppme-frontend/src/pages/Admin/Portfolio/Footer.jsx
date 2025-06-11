import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="newsletter">
        <div className="subscribe-box">
          <input
            type="email"
            placeholder="Subscribe to news letter"
            className="subscribe-input"
          />
          <button className="subscribe-button">→</button>
        </div> 
      </div>

      <div className="contact-info">
        <p>Feel free to contact us for more information or support.</p>
        <p className="contact-details">
          Phone: +91 7598527523 | Email: info@helppme.in | support@helppme.in
        </p>
      </div>

      <div className="copyright">
        <p>© 2025 Helppme.in All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
