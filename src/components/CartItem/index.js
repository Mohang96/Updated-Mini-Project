import {Component} from 'react'

import {BiRupee} from 'react-icons/bi'

import './index.css'

class CartItem extends Component {
  state = {quantity: 1}

  componentDidMount() {
    this.updateStateQuantity()
  }

  updateStateQuantity = () => {
    const {itemDetails} = this.props
    const {quantity} = itemDetails
    this.setState({quantity})
  }

  renderButtons = () => {
    const {itemDetails} = this.props
    const {quantity} = itemDetails

    return (
      <div>
        <button
          type="button"
          className="cart-item-btn"
          onClick={this.decreaseCartItemQuantity}
        >
          -
        </button>
        <span className="cart-item-quantity">{quantity}</span>
        <button
          type="button"
          className="cart-item-btn"
          onClick={this.increaseCartItemQuantity}
        >
          +
        </button>
      </div>
    )
  }

  decreaseCartItemQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  increaseCartItemQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  render() {
    const {itemDetails} = this.props
    const {name, imageUrl, cost, quantity} = itemDetails

    return (
      <li className="cart-item-background">
        <img src={imageUrl} alt="cart item" className="cart-item-food-image" />
        <div className="cart-item-details-background">
          <h1 className="cart-item-food-name">{name}</h1>
          {this.renderButtons()}
          <div className="cart-item-cost-container">
            <BiRupee />
            <p className="cart-item-cost">{cost * quantity}</p>
          </div>
        </div>
      </li>
    )
  }
}

export default CartItem
