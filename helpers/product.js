module.exports.priceNewProducts = (products) => {
    return products.map(product => {
        product.priceNew = ((product.price * (100-product.discountPercentage))/100).toFixed();
        return product;
    })
}


module.exports.priceNewProduct = (product) => {
    return ((product.price * (100-product.discountPercentage))/100).toFixed();
}