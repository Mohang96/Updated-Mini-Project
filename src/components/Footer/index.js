import {
  FaPinterestSquare,
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="website-footer-background">
    <div className="footer-logo-and-title-container">
      <img
        src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1711348860/website-white-logo_gpzbh5.png"
        alt="website-footer-logo"
        className="website-footer-logo"
      />
      <h1 className="footer-title">Tasty Kitchens</h1>
    </div>
    <p className="website-footer-msg">
      The only thing we are serious about is food. <br />
      Contact us on
    </p>
    <ul className="footer-social-icons-list">
      <li>
        <FaPinterestSquare
          className="footer-social-icon p-interest-icon"
          testid="pintrest-social-icon"
        />
      </li>
      <li>
        <FaInstagram
          className="footer-social-icon instagram-icon"
          testid="instagram-social-icon"
        />
      </li>
      <li>
        <FaTwitter
          className="footer-social-icon twitter-icon"
          testid="twitter-social-icon"
        />
      </li>
      <li>
        <FaFacebookSquare
          className="footer-social-icon facebook-icon"
          testid="facebook-social-icon"
        />
      </li>
    </ul>
  </div>
)

export default Footer
