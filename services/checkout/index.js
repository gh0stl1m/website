import { isEmpty } from 'lodash'
import cryptoRandomString from 'crypto-random-string'

import WooCommerceService from '../woocommerce'

import createSignature from '../../utils/createSignature'
import { epaycoToWooCommerce } from '../../utils/orderStatusMapper'
import { parseOrder } from '../../utils/parseResponse'

const { config } = require('../../config/server')

class CheckoutService {
  constructor() {
    this.wooCommerceService = new WooCommerceService()
  }

  buildAddress({ userInfo }) {
    const {
      billingAddress,
      complementaryBillingAddress,
      billingCountry,
      billingCity
    } = userInfo

    return {
      address_1: billingAddress,
      address_2: complementaryBillingAddress,
      country: billingCountry,
      city: billingCity
    }
  }

  buildCustomerBilling({ userInfo }) {
    const { email, firstname, lastname, cellphone } = userInfo

    return {
      email,
      first_name: firstname,
      last_name: lastname,
      phone: cellphone,
      ...this.buildAddress({ userInfo })
    }
  }

  buildCustomer({ userInfo }) {
    const { email, firstname, lastname } = userInfo

    return {
      email,
      first_name: firstname,
      last_name: lastname,
      billing: this.buildCustomerBilling({ userInfo }),
      password: cryptoRandomString(16)
    }
  }

  buildPaymentMethod({ userInfo }) {
    const { paymentMethod } = userInfo

    if (paymentMethod === 'epayco') {
      return {
        payment_method: 'epayco',
        payment_method_title: 'ePayco'
      }
    } else {
      return {
        payment_method: paymentMethod,
        payment_method_title: paymentMethod
      }
    }
  }

  mapProducts({ id, quantity }) {
    return { quantity, product_id: id }
  }

  buildOrder({ customer, userInfo, products }) {
    return {
      ...this.buildPaymentMethod({ userInfo }),
      customer_id: customer.id,
      line_items: products,
      billing: this.buildCustomerBilling({ userInfo }),
      customer_note: userInfo.comments
    }
  }

  async getOrCreateCustomer({ userInfo }) {
    const customers = await this.wooCommerceService.getCustomer({
      customerEmail: userInfo.email
    })

    if (isEmpty(customers)) {
      return this.wooCommerceService.createCustomer({
        customer: this.buildCustomer({ userInfo })
      })
    } else {
      return Promise.resolve(customers[0])
    }
  }

  async createOrder({ customer, userInfo, shoppingCartItems }) {
    const products = shoppingCartItems.map(this.mapProducts)

    const created = await this.wooCommerceService.createOrder({
      order: this.buildOrder({ customer, userInfo, products })
    })

    return Promise.resolve(created)
  }

  async processCheckout({ userInfo, shoppingCartItems }) {
    const customer = await this.getOrCreateCustomer({ userInfo })
    const order = await this.createOrder({
      customer,
      userInfo,
      shoppingCartItems
    })

    return Promise.resolve({
      order: parseOrder(order, ['order_key'])
    })
  }

  confirmOrder(ePaycoPayload) {
    const { ePaycoClientId, ePaycoSecretKey } = config
    const { x_id_invoice: orderId, x_cod_response: code } = ePaycoPayload

    const signature = createSignature(
      ePaycoPayload,
      ePaycoClientId,
      ePaycoSecretKey
    )

    if (signature !== ePaycoPayload.x_signature) {
      return Promise.reject(new Error('Signature is not valid.'))
    }

    if (!code || code > 4 || code < 1) {
      return Promise.reject(new Error(`Code not valid: ${code}`))
    }

    return this.wooCommerceService.updateOrder(orderId, {
      status: epaycoToWooCommerce(code)
    })
  }
}

export default CheckoutService