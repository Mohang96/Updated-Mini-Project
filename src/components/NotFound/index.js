import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-background">
    <img
      src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1711442833/not-found-image_q9mnos.png"
      alt="not found"
    />
    <h1 className="not-found-page-heading">Page Not Found</h1>
    <p className="not-found-page-msg">
      We are sorry, the page you requested could not be found. Please go back to
      the homepage
    </p>
    <Link to="/">
      <button type="button" className="not-found-page-button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
