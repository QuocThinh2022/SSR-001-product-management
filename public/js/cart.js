
// Cap nhat so luong san pham trong gio hang 
const inputsQuantity = document.querySelectorAll('input[name="quantity"]')
if (inputsQuantity.length > 0) {
    inputsQuantity.forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = input.getAttribute('product-id')
            const quantity = parseInt(input.value);
            if (quantity >= 1)
                window.location.href = `/cart/update/${productId}/${quantity}`;
            else
                window.location.href = `/cart/delete/${productId}`;
        })
    })
}
// end cap nhat so luong san pham trong gio hang 