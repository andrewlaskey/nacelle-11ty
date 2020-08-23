import NacelleClient from '@nacelle/client-js-sdk'

const client = new NacelleClient({
  id: process.env.NACELLE_SPACE_ID,
  token: process.env.NACELLE_SPACE_TOKEN,
  locale: 'en-us',
  nacelleEndpoint: 'https://hailfrequency.com/v2/graphql',
  useStatic: false
})

const cartLocalStorage = localStorage.getItem('cart')
const cart = cartLocalStorage ? JSON.parse(cartLocalStorage) : []

const addToCartButton = document.querySelector('.add-to-cart')
const checkoutButton = document.querySelector('.checkout')
const cartEl = document.querySelector('.cart')
const cartItemsEl = document.querySelector('.cart-items')
const cartToggleButtons = document.querySelectorAll('.toggle-cart')

const loadCart = function() {
  const html = cart.map(item => {
    return `
<div class="cart-item">
  <h3><a href="/products/${item.handle}/">${item.title}</a></h3>
  <p>$${item.price}</p>
  <button class="remove-item" data-product-id="${item.cartItemId}">Remove</button>
</div>
    `
  }).join('')

  cartItemsEl.innerHTML = html
}

const updateCart = function () {
  localStorage.setItem('cart', JSON.stringify(cart))
  loadCart()
}

loadCart()

// Process Checkout
checkoutButton.addEventListener('click', () => {
  const cartItems = cart.map(lineItem => {
    const {
      cartItemId,
      variantId,
      quantity
    } = lineItem
    
    return {
      cartItemId,
      variantId,
      quantity
    }
  })

  client.checkout.process({
    cartItems
  }).then(result => {
    if (result && result.url) {
      window.location =result.url
    }
  }).catch(error => {
    alert(error)
  })
})

// Remove Item From Cart
cartItemsEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    console.log('Remove Item')
    const button = e.target
    const id = button.getAttribute('data-product-id')

    const index = cart.findIndex(item => item.cartItemId === id)

    if (index > -1) {
      cart.splice(index, 1);
    }

    updateCart()
  }
})

// Add To Cart
if (addToCartButton) {
  addToCartButton.addEventListener('click', () => {
    console.log('Add to Cart')

    const product = window.product
    const cartProduct = {
      title: product.title,
      variantId: product.variants[0].id,
      quantity: 1,
      cartItemId: product.pimSyncSourceProductId,
      handle: product.handle,
      price: product.priceRange.max
    }

    cart.push(cartProduct)
    updateCart()
    cartEl.classList.toggle('is-open')
  })
}

cartToggleButtons.forEach(el => {
  el.addEventListener('click', () => {
    cartEl.classList.toggle('is-open')
  })
})
