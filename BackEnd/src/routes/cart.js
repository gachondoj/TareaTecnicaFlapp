const Router = require('koa-router');
const router = new Router();
const fetch = require('node-fetch');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false,
});


const dolarPrice = 1000;


router.post('/', async (ctx, next) => {
  if (!ctx.request.body.products || !ctx.request.body.customer_data) {
    ctx.status = 400
    ctx.body = 'ERROR'
  } else {
    const cart = ctx.request.body.products
    const customer = ctx.request.body.customer_data
    
    const store = {
      name: "Tienda Flapp",
      phone: "+569 1234 5678",
      address: "Juan de Valiente 360",
      city: "Vitacura"
    }

    const productsRes = await fetch('https://dummyjson.com/products?limit=0')
    const productsJson = await productsRes.json();
    const products = productsJson.products

    const newCart = cart.map((product) => {
      const productsListProduct = products.find((_product) => product.productId == _product.id)
      
      return {
        id: productsListProduct.id,
        title: productsListProduct.title,
        price: productsListProduct.price,
        discount: productsListProduct.price * productsListProduct.discountPercentage / 100,
        requestedAmount: product.quantity,
        stock: productsListProduct.stock,
        rating: productsListProduct.rating,
        realStock: Math.floor(productsListProduct.stock / productsListProduct.rating),
        dimensions: productsListProduct.dimensions
      }
    }) 
    console.log(newCart)

    for (element of newCart) {
      if (element.requestedAmount > element.realStock) {
        ctx.status = 400;
        ctx.body = {"body": `No hay stock suficiente de ${element.title}`}
        return
      }
    }

    const traeloBody = {
      "items": newCart.map((item) => ({
        "quantity": item.requestedAmount, 
        "value": item.price, 
        "volume": item.dimensions.width * item.dimensions.height * item.dimensions.depth })),        
      "waypoints": [
        {
          "type": "PICK_UP",
          "addressStreet": store.address,
          "city": store.city,
          "phone": store.phone,
          "name": store.name
        },
        {
          "type": "DROP_OFF",
          "addressStreet": customer.shipping_street,
          "city": customer.commune,
          "phone": customer.phone,
          "name": customer.name
        }
      ]
    }

    const uderBody = {
      "pickup_address": store.address,
      "pickup_name": store.name,
      "pickup_phone_number": store.phone,
      "dropoff_address": customer.shipping_street,
      "dropoff_name": customer.name,
      "dropoff_phone_number": customer.phone,
      "manifest_items": newCart.map((item) => ({ 
        "name": item.title, 
        "quantity": item.requestedAmount, 
        "price": item.price,
        "dimensions": { "length": item.dimensions.width, "height": item.dimensions.height, "depth": item.dimensions.depth}
      }))
    }

    const traeloRes = await fetch('https://recruitment.weflapp.com/tarifier/traelo_ya', {
      agent,
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": process.env.TRAELO_KEY,
      },
      body: JSON.stringify(traeloBody)

    })
    const traeloJson = await traeloRes.json();

    console.log('traelo', traeloRes.status, traeloJson)

    const uderRes = await fetch('https://recruitment.weflapp.com/tarifier/uder', {
      agent,
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": process.env.UDER_KEY,
      },
      body: JSON.stringify(uderBody)
    })

    const uderJson = await uderRes.json();

    console.log('uder', uderRes.status, uderJson)

    if (uderJson.error && traeloJson.error) {
      ctx.status = 400
      ctx.body = {"body": 'No hay envíos disponibles :('}
    } else if (uderJson.error) {
      ctx.status = 200
      ctx.body = { courier: 'TraeloYa', price: traeloJson.deliveryOffers.pricing.total}
    } else if (traeloJson.error) {
      ctx.status = 200
      ctx.body = { courier: 'Uder', price: uderJson.fee * dolarPrice}
    } else if (uderJson.fee * dolarPrice > traeloJson.deliveryOffers.pricing.total) {
      ctx.status = 200
      ctx.body = { courier: 'TraeloYa', price: traeloJson.deliveryOffers.pricing.total}
    } else {
      ctx.status = 200
      ctx.body = { courier: 'Uder', price: uderJson.fee * dolarPrice}
    }


  
  }
});

module.exports = router;