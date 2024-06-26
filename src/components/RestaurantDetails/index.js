import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {FaStar} from 'react-icons/fa'
import {BiRupee} from 'react-icons/bi'

import Header from '../Header'
import FoodItem from '../FoodItem'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class RestaurantDetails extends Component {
  state = {
    specificRestaurantApiStatus: apiStatusConstants.initial,
    specificRestaurantDetails: {},
    foodItemsList: [],
  }

  componentDidMount() {
    this.getSpecificRestaurantDetails()
  }

  getSpecificRestaurantDetails = async () => {
    this.setState({specificRestaurantApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const specificRestaurantDetailsApiUrl = `https://apis.ccbp.in/restaurants-list/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(specificRestaurantDetailsApiUrl, options)
    const data = await response.json()
    const restaurantDetails = this.getFormattedRestaurantDetails(data)

    if (response.ok) {
      this.setState({
        specificRestaurantApiStatus: apiStatusConstants.success,
        specificRestaurantDetails: restaurantDetails,
        foodItemsList: data.food_items.map(eachItem => ({
          cost: eachItem.cost,
          foodType: eachItem.food_type,
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          name: eachItem.name,
          rating: eachItem.rating,
        })),
      })
    }
  }

  getFormattedRestaurantDetails = restaurantDetails => ({
    costForTwo: restaurantDetails.cost_for_two,
    cuisine: restaurantDetails.cuisine,
    id: restaurantDetails.id,
    imageUrl: restaurantDetails.image_url,
    itemsCount: restaurantDetails.items_count,
    location: restaurantDetails.location,
    name: restaurantDetails.name,
    opensAt: restaurantDetails.opens_at,
    rating: restaurantDetails.rating,
    reviewsCount: restaurantDetails.reviews_count,
  })

  renderSpecificRestaurantDetails = () => {
    const {specificRestaurantApiStatus} = this.state

    switch (specificRestaurantApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  renderLoadingView = () => (
    <div className="loading-view-background">
      <Loader
        testid="restaurant-details-loader"
        type="ThreeDots"
        color="#F7931E"
        height={60}
        width={60}
      />
    </div>
  )

  renderSuccessView = () => (
    <div className="success-view-background">
      {this.renderRestaurantDetails()}
      {this.renderRestaurantMenuDetails()}
    </div>
  )

  renderRestaurantDetails = () => {
    const {specificRestaurantDetails} = this.state
    const {
      imageUrl,
      name,
      cuisine,
      location,
      rating,
      reviewsCount,
      costForTwo,
    } = specificRestaurantDetails

    return (
      <div className="restaurant-image-and-details-background">
        <div className="restaurant-image-and-details-responsive-background">
          <div className="restaurant-image-background">
            <img
              src={imageUrl}
              alt="restaurant"
              className="specific-restaurant-image"
            />
          </div>
          <div className="specific-restaurant-details-background">
            <h1 className="specific-restaurant-name">{name}</h1>
            <p className="specific-restaurant-type">{cuisine}</p>
            <p className="restaurant-location">{location}</p>
            <div className="rating-and-cost-container">
              <div className="rating-container">
                <div className="rating-cost-common-container">
                  <FaStar className="rating-star-and-rupee-icon" />
                  <h1 className="rating-and-cost">{rating}</h1>
                </div>
                <span className="reviews-count-and-cost-for-two">{`${reviewsCount}+ Ratings`}</span>
              </div>
              <hr className="vertical-line" />
              <div className="rating-container">
                <div className="rating-cost-common-container">
                  <BiRupee className="rating-star-and-rupee-icon" />
                  <h1 className="rating-and-cost">{costForTwo}</h1>
                </div>
                <span className="reviews-count-and-cost-for-two">
                  Cost For Two
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderRestaurantMenuDetails = () => {
    const {foodItemsList} = this.state

    return (
      <div className="restaurant-food-items-list-background">
        <ul className="restaurant-food-items-list">
          {foodItemsList.map(eachItem => (
            <FoodItem key={eachItem.id} itemDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <div className="specific-restaurant-page-background">
        <Header />
        {this.renderSpecificRestaurantDetails()}
        <Footer />
      </div>
    )
  }
}

export default RestaurantDetails
