require('dotenv').config()

const NacelleClient = require('@nacelle/client-js-sdk').default

const client = new NacelleClient({
  id: process.env.NACELLE_SPACE_ID,
  token: process.env.NACELLE_SPACE_TOKEN,
  locale: 'en-us',
  nacelleEndpoint: 'https://hailfrequency.com/v2/graphql',
  useStatic: false
})

module.exports = async function () {
  const catalog = await client.data.allProducts()
  
  return catalog.filter(product => {
    return product.locale === 'en-us'
  })
}