import {Component} from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'
import Footer from '../Footer'
import CartItem from '../CartItem'

import './index.css'

class Cart extends Component {
  state = {
    showPaymentSuccessMsg: false,
  }

  renderCartEmptyView = () => (
    <div className="cart-empty-view-background">
      <div>
        <img
          src="https://res.cloudinary.com/dvppnhb4r/image/upload/v1712818933/empty_cart_view_dish_aqtreq.png"
          alt="empty cart"
          className="cart-empty-view-dish"
        />
        <h1 className="cart-empty-view-msg">No Orders Yet!</h1>
        <p className="cart-empty-view-feedback">
          Your cart is empty. Add something from the menu.
        </p>
        <Link to="/">
          <button type="button" className="order-now-btn">
            Order Now
          </button>
        </Link>
      </div>
    </div>
  )

  renderCartDataView = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData'))

    return (
      <>
        <div className="cart-data-view-background">
          <div className="cart-data-view-responsive-background">
            <ul className="cart-data-list">
              {cartData.map(eachCartItem => (
                <CartItem key={eachCartItem.id} itemDetails={eachCartItem} />
              ))}
            </ul>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  render() {
    const cartData = JSON.parse(localStorage.getItem('cartData'))
    if (cartData === null || cartData.length === 0) {
      return (
        <div className="cart-background">
          <Header />
          {this.renderCartEmptyView()}
        </div>
      )
    }
    return (
      <div className="cart-background">
        <Header />
        {this.renderCartDataView()}
      </div>
    )
  }
}

export default Cart
