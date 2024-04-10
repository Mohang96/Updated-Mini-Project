import {Component} from 'react'

import {BiRupee} from 'react-icons/bi'

import './index.css'

let cartData = null

class FoodItem extends Component {
  state = {showAddBtn: true, quantity: 0}

  onClickAddBtn = () => {
    this.setState(
      prevState => ({
        showAddBtn: !prevState.showAddBtn,
        quantity: prevState.quantity + 1,
      }),
      this.addItemToCart,
    )
  }

  addItemToCart = () => {
    const {itemDetails} = this.props
    const {name, cost, imageUrl, id} = itemDetails
    const {quantity} = this.state
    cartData =
      JSON.parse(localStorage.getItem('cartData')) === null
        ? []
        : JSON.parse(localStorage.getItem('cartData'))
    const cartItem = {
      cost,
      quantity,
      id,
      imageUrl,
      name,
    }
    const updatedCartData = [...cartData, cartItem]
    localStorage.setItem('cartData', JSON.stringify(updatedCartData))
  }

  renderButtons = () => {
    const {quantity} = this.state
    return (
      <>
        <button type="button" onClick={this.onClickDecreaseQuantity}>
          -
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={this.onClickIncreaseQuantity}>
          +
        </button>
      </>
    )
  }

  onClickDecreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
    if (quantity === 1) {
      this.setState(
        prevState => ({
          showAddBtn: !prevState.showAddBtn,
          quantity: prevState.quantity - 1,
        }),
        this.removeCurrentCartItem,
      )
    }
  }

  removeCurrentCartItem = () => {}

  onClickIncreaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  render() {
    const {itemDetails} = this.props
    const {name, cost, imageUrl, rating} = itemDetails
    const {showAddBtn} = this.state

    return (
      <li className="food-item-background">
        <img src={imageUrl} alt="food-item" className="food-item" />
        <div className="food-item-details-background">
          <h1 className="food-item-name">{name}</h1>
          <span className="food-item-cost-and-rating-container">
            <BiRupee className="food-item-cost-icon" />
            <p className="food-item-cost food-item-cost-and-rating">{cost}</p>
          </span>
          <span className="food-item-cost-and-rating-container">
            <img
              src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1708069308/star-filled-image_ywf1ba.png"
              alt="star"
              className="food-item-rating-star"
            />
            <p className="food-item-rating food-item-cost-and-rating">
              {rating}
            </p>
          </span>
          {showAddBtn && (
            <button type="button" onClick={this.onClickAddBtn}>
              Add
            </button>
          )}
          {!showAddBtn && (
            <div className="buttons-container">{this.renderButtons()}</div>
          )}
        </div>
      </li>
    )
  }
}

export default FoodItem
