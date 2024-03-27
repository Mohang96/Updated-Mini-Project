import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import {MdSort} from 'react-icons/md'
import {FaSortDown} from 'react-icons/fa'
import {BsCheck2, BsArrowLeftSquare, BsArrowRightSquare} from 'react-icons/bs'
import {AiOutlineLeftSquare, AiOutlineRightSquare} from 'react-icons/ai'

import Header from '../Header'
import RestaurantItem from '../RestaurantItem'
import Footer from '../Footer'

import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Lowest',
    value: 'Lowest',
  },
  {
    id: 1,
    displayText: 'Highest',
    value: 'Highest',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

const limit = 9

class Home extends Component {
  state = {
    carouselApiStatus: apiStatusConstants.initial,
    carouselImagesList: [],
    restaurantApiStatus: apiStatusConstants.initial,
    restaurantDetailsList: [],
    activeSortOption: sortByOptions[0].value,
    activePageNo: 1,
  }

  componentDidMount() {
    this.getCarouselAndRestaurantDetails()
  }

  getCarouselAndRestaurantDetails = () => {
    this.getCarouselDetails()
    this.getRestaurantDetails()
  }

  getCarouselDetails = async () => {
    this.setState({carouselApiStatus: apiStatusConstants.inProgress})
    const carouselApiUrl = 'https://apis.ccbp.in/restaurants-list/offers'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(carouselApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      this.setState({
        carouselImagesList: data.offers.map(eachItem => ({
          id: eachItem.id,
          imageUrl: eachItem.image_url,
        })),
        carouselApiStatus: apiStatusConstants.success,
      })
    }
  }

  getRestaurantDetails = async () => {
    this.setState({restaurantApiStatus: apiStatusConstants.inProgress})
    const {activeSortOption, activePageNo} = this.state
    const offset = (activePageNo - 1) * limit
    const restaurantsApiUrl = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${limit}?sort_by_rating=${activeSortOption}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(restaurantsApiUrl, options)
    const data = await response.json()
    const orderedRestaurantsList = this.getOrderedRestaurantsList(
      data.restaurants,
    )

    if (response.ok) {
      this.setState({
        restaurantApiStatus: apiStatusConstants.success,
        restaurantDetailsList: orderedRestaurantsList.map(eachRestaurant =>
          this.getFormattedData(eachRestaurant),
        ),
      })
    }
  }

  getOrderedRestaurantsList = restaurantsList => {
    const {activeSortOption} = this.state
    if (activeSortOption === 'Lowest') {
      restaurantsList.sort(
        (x, y) => x.user_rating.rating - y.user_rating.rating,
      )
      return restaurantsList
    }
    restaurantsList.sort((x, y) => y.user_rating.rating - x.user_rating.rating)
    return restaurantsList
  }

  getFormattedData = restaurantDetails => ({
    costForTwo: restaurantDetails.cost_for_two,
    cuisine: restaurantDetails.cuisine,
    groupByTime: restaurantDetails.group_by_time,
    hasOnlineDelivery: restaurantDetails.has_online_delivery,
    hasTableBooking: restaurantDetails.has_table_booking,
    id: restaurantDetails.id,
    imageUrl: restaurantDetails.image_url,
    isDeliveringNow: restaurantDetails.is_delivering_now,
    location: restaurantDetails.location,
    menuType: restaurantDetails.menu_type,
    name: restaurantDetails.name,
    opensAt: restaurantDetails.opens_at,
    userRating: {
      rating: restaurantDetails.user_rating.rating,
      ratingColor: restaurantDetails.user_rating.rating_color,
      ratingText: restaurantDetails.user_rating.rating_text,
      totalReviews: restaurantDetails.user_rating.total_reviews,
    },
  })

  renderCarousels = () => {
    const {carouselApiStatus} = this.state

    switch (carouselApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderCarouselInProgressView()
      case apiStatusConstants.success:
        return this.renderCarouselSuccessView()
      default:
        return null
    }
  }

  renderCarouselInProgressView = () => (
    <div className="carousel-in-progress-view">
      <Loader type="ThreeDots" color="#F7931E" height={60} width={60} />
    </div>
  )

  renderCarouselSuccessView = () => {
    const {carouselImagesList} = this.state
    const dotsClassName = 'dots-container'
    const settings = {
      dots: true,
      infinite: true,
      fade: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      appendDots: dots => (
        <div>
          <ul className={dotsClassName}>{dots}</ul>
        </div>
      ),
    }

    return (
      <div className="carousel-image-background">
        <Slider {...settings}>
          {carouselImagesList.map(eachCarousel => (
            <img
              src={eachCarousel.imageUrl}
              key={eachCarousel.id}
              alt="offer"
              className="carousel"
            />
          ))}
        </Slider>
      </div>
    )
  }

  renderSortFeature = () => {
    const {activeSortOption} = this.state

    return (
      <div className="sort-feature-container">
        <div className="sort-icon-box">
          <MdSort className="sort-icon" />
        </div>
        <div>
          <span className="sort-by-text">Sort by</span>
          <select
            value={activeSortOption}
            onChange={this.onChangeSortOption}
            id="sortOptionsDropDown"
            className="sort-option"
          >
            {sortByOptions.map(eachOption => (
              <option
                key={eachOption.id}
                value={eachOption.value}
                className="sort-option"
              >
                {eachOption.displayText}
              </option>
            ))}
          </select>
          <FaSortDown />
        </div>
      </div>
    )
  }

  onChangeSortOption = event => {
    this.setState(
      {activeSortOption: event.target.value},
      this.getRestaurantDetails,
    )
  }

  renderRestaurants = () => {
    const {restaurantApiStatus} = this.state

    switch (restaurantApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderRestaurantsInProgressView()
      case apiStatusConstants.success:
        return this.renderRestaurantsSuccessView()
      default:
        return null
    }
  }

  renderRestaurantsInProgressView = () => (
    <div className="restaurants-in-progress-view">
      <Loader type="ThreeDots" color="#F7931E" height={60} width={60} />
    </div>
  )

  renderRestaurantsSuccessView = () => {
    const {restaurantDetailsList} = this.state
    if (restaurantDetailsList.length === 0) {
      return (
        <div className="restaurants-success-view empty-restaurants-view">
          <p className="empty-restaurants-view-msg">No More Restaurants!!!</p>
        </div>
      )
    }

    return (
      <div className="restaurants-success-view">
        <ul className="restaurants-list">
          {restaurantDetailsList.map(eachRestaurant => (
            <RestaurantItem
              key={eachRestaurant.id}
              restaurantDetails={eachRestaurant}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderPagination = () => {
    const {activePageNo} = this.state

    return (
      <div className="pagination-container">
        <AiOutlineLeftSquare
          onClick={this.onClickLeftArrow}
          testid="pagination-left-button"
          className="pagination-button"
        />
        {/* <button
          type="button"
          onClick={this.onClickLeftArrow}
          className="pagination-button"
        >
          <img
            src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1711346016/left-arrow-icon_vypgxs.png"
            alt="pagination-left-arrow"
          />
        </button> */}
        <div className="pagination-page-numbers-display-container">
          <span>{activePageNo}</span> of 20
        </div>
        <AiOutlineRightSquare
          onClick={this.onClickRightArrow}
          testid="pagination-right-button"
          className="pagination-button"
        />
        {/* <button
          type="button"
          onClick={this.onClickRightArrow}
          className="pagination-button"
        >
          <img
            src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1711346016/right-arrow-icon_kgt7pk.png"
            alt="pagination-right-arrow"
          />
        </button> */}
      </div>
    )
  }

  onClickLeftArrow = () => {
    const {activePageNo} = this.state
    if (activePageNo > 1) {
      this.setState(
        prevState => ({
          activePageNo: prevState.activePageNo - 1,
        }),
        this.getRestaurantDetails,
      )
    }
  }

  onClickRightArrow = () => {
    const {activePageNo, restaurantDetailsList} = this.state
    if (activePageNo < 20 && restaurantDetailsList.length > 0) {
      this.setState(
        prevState => ({
          activePageNo: prevState.activePageNo + 1,
        }),
        this.getRestaurantDetails,
      )
    }
  }

  render() {
    return (
      <div className="home-background">
        <Header />
        <div className="carousel-images-background">
          {this.renderCarousels()}
        </div>
        <div className="restaurants-background">
          <h1 className="popular-restaurants-text">Popular Restaurants</h1>
          <div className="restaurants-description-and-sort-feature-container">
            <p className="restaurants-description">
              Select Your favourite restaurant special dish and make your day
              happy...
            </p>
            {this.renderSortFeature()}
          </div>
          <div className="restaurants-list-background">
            {this.renderRestaurants()}
            {this.renderPagination()}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
