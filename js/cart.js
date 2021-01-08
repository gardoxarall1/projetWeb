var cart = [];
var shipping = 0; //set shipping price
    
if (localStorage.cart)
{
    cart = JSON.parse(localStorage.cart);
}  
showCart();
function showCart() {
    if (cart.length == 0) {
        // hide cart
        document.querySelector(".cart-count-badge").style.visibility = "hidden"; 
        document.querySelector('.cart-text .amount').innerHTML = '<span class="currencySymbol">$</span> 0';
        document.querySelector('.cart-widget-box').innerHTML ='<p>Your cart is empty.</p>';
        return;
    }
    document.querySelector(".cart-count-badge").style.visibility = "visible"; 
    var cartPopHtml = '<ul class="cart-items">';
    var totalAmount = 0;
    var items = 0;
    for (var i in cart) {
        var item = cart[i];
        cartPopHtml += " <li class='single-cart'>"
                    +"       <a href=\"#\" class=\"cart-product\">"
                    +"           <div class=\"cart-product-img\">"
                    +"                <img src=\""+item.Image+"\" alt=\"Selected Products\">"
                    +"            </div>"
                    +"            <div class=\"product-details\">"
                    +"                <h4 class=\"product-details--title\">"+item.Product+"</h4>"
                    +"                <span class=\"product-details--price\">$" + item.Price + " * "+item.Qty+"</span>" 
                    +"            </div>"
                    +"            <span class=\"cart-cross\" onclick='deleteItem(" + i + ")'>x</span>"
                    +"        </a>"
                    +"    </li>";
        totalAmount += item.Price * parseInt(item.Qty);
        items += parseInt(item.Qty);
    }
    totalAmount = totalAmount.toFixed(2);
    cartPopHtml +='<li class="single-cart">'
                        +'<div class="cart-product__subtotal">'
                            +'<span class="subtotal--title">Subtotal</span>'
                            +'<span class="subtotal--price">$'+ totalAmount+'</span>'
                            +'    </div>'
                    +'</li>'
                    +'<li class="single-cart">'
                        +'<div class="cart-buttons">'
                        +'<a href="cart.html" class="btn btn-outlined">View Cart</a>'
                            +'<a href="checkout.html" class="btn btn-outlined">Check Out</a>'
                            +'</div>'
                        +'</li>'
                    +'</ul>';
    document.querySelector('.cart-text .amount').innerHTML = '<span class="currencySymbol">$</span> '+ totalAmount;
    document.querySelector('.cart-widget-box').innerHTML = cartPopHtml;
    document.querySelector(".cart-count-badge").innerText = items;
}

function addToCart(el) {
    var product = el.closest('.pm-product');
    var price = parseFloat(product.querySelectorAll('.price')[0].innerText.replace('$', ''));  // get selected product's price
    var name = product.querySelectorAll('.content h3')[0].innerText;  // get product name
    var qty = 1;  // get quantity
    var image = product.getElementsByTagName('img')[0].src;  // get product name
    
    // update Qty if product is already present
    for (var i in cart) {
        if(cart[i].Product == name)
        {
            cart[i].Qty += qty;  // replace existing Qty
            el.innerText = 'Product Added';
            setTimeout(function(){
                el.innerText = 'Add To Cart';
            }, 3000);
            showCart();
            saveCart();
            return;
        }
    }

    var item = { Product: name,  Price: price, Qty: qty, Image:image };
    cart.push(item);
    el.innerText = 'Product Added';
    setTimeout(function(){
        el.innerText = 'Add To Cart';
    }, 3000);
    saveCart();
    showCart();
}
function saveCart() {
    if (window.localStorage)
    {
        localStorage.cart = JSON.stringify(cart);
    }
}

function deleteItem(index){
    cart.splice(index,1); // delete item at index
    showCart();
    saveCart();
    if (document.querySelectorAll("#cart_area").length > 0 ){
        showCartPage();
    }
    if (document.querySelectorAll("#checkout-subtotal").length > 0){
        showCheckoutOrderOverview();
    }
}
function showCheckoutOrderOverview() {
    if (cart.length == 0) {
        window.location = "/index.html";
        return;
    }
    var cartPopHtml = '';
    var totalAmount = 0;
    for (var i in cart) {
        var item = cart[i];
        cartPopHtml += "<li><span class=\"left\">"
                    +item.Product+"</span> <span class=\"right\">$"
                    + item.Price + "</span></li>";
        totalAmount += item.Price * item.Qty;
    }
    document.querySelector('#checkout-subtotal').innerHTML = '$'+ totalAmount.toFixed(2);
    document.querySelector('#checkout-shipping').innerHTML = '$'+ shipping;
    document.querySelector('#checkout-grandtotal').innerHTML = '$'+ (totalAmount+shipping).toFixed(2);
    document.querySelector('#checkout-items').innerHTML = cartPopHtml;
}
function showCartPage() {
    if (cart.length == 0) {
        document.querySelectorAll('.cart-section-2')[0].style.visibility = 'hidden';
        document.querySelectorAll('.cart_area form')[0].style.visibility = 'hidden';
        document.querySelectorAll('.cart_area .col-12')[0].innerHTML = '<p>No Item in your cart.</p>';
        return;
    }
    var cartPopHtml = '';
    var totalAmount = 0;
    for (var i in cart) {
        var item = cart[i];
        cartPopHtml += "<tr class=\"product-row\">"
                    +"        <td class=\"pro-remove\"><a href=\"#\" onclick='deleteItem(" + i + ")'><i class=\"far fa-trash-alt\"></i></a></td>"
                    +"        <td class=\"pro-thumbnail\"><a href=\"#\"><img src=\""+item.Image+"\" alt=\"Product\"></a></td>"
                    +"        <td class=\"pro-title\"><a href=\"#\">"+item.Product+"</a></td>"
                    +"        <td class=\"pro-price\"><span>$"
                    + item.Price + "</span></td>"
                    +"        <td class=\"pro-quantity\">"
                    +"           <div class=\"pro-qty\">"
                    +"                <div class=\"count-input-block\">"
                    +"                    <input type=\"number\" name=\"qty\" class=\"form-control text-center\" value=\""+item.Qty+"\">"
                    +"                </div>"
                    +"            </div>"
                    +"        </td>"
                    +"        <td class=\"pro-subtotal\"><span>$"
                    + (item.Price * item.Qty).toFixed(2) + "</span></td>"
                    +"    </tr>";
        totalAmount += item.Price * item.Qty;
    }
    cartPopHtml += "<tr>"
                +"        <td colspan=\"6\" class=\"actions\">"
                +"            <div class=\"coupon-block\">"
                +"                <div class=\"coupon-text\">"
                +"                    <label for=\"coupon_code\">Coupon:</label>"
                +"                    <input type=\"text\" name=\"coupon_code\" class=\"input-text\" id=\"coupon_code\" value=\"\" placeholder=\"Coupon code\">"
                +"                </div>"
                +"                <div class=\"coupon-btn\">"
                +"                    <input type=\"submit\" class=\"btn-black\" name=\"apply_coupon\" value=\"Apply coupon\">"
                +"                </div>"
                +"            </div>"
                +"            <div class=\"update-block text-right\">"
                +"                <input type=\"submit\" onclick=\"updateCart()\" class=\"btn-black\" name=\"update_cart\" value=\"Update cart\">"
                +"            </div>"
                +"        </td>"
                +"    </tr>";
                

    document.querySelector('.cartpage-subtotal').innerHTML = '$'+ totalAmount.toFixed(2);
    document.querySelector('.cartpage-shipping').innerHTML = '$'+ shipping;
    document.querySelector('.cartpage-grandtotal').innerHTML = '$'+ (totalAmount+shipping).toFixed(2);
    document.querySelector('.cart-table tbody').innerHTML = cartPopHtml;

    if (document.getElementById('contactChoice1').checked){
        document.getElementById('contactChoice2').checked = false;

        document.querySelector('.cartpage-grandtotal').innerHTML = '$'+ (((totalAmount+totalAmount*0.19))).toFixed(2);

    }
                else if (document.getElementById('contactChoice2').checked){ 
                    document.getElementById('contactChoice1').checked = false;
                    document.querySelector('.cartpage-grandtotal').innerHTML = '$'+ (((totalAmount+totalAmount*0.1))).toFixed(2);

                }
                
    saveCart();
    var item = { Product: name,  Price: price, Qty: qty, Image:image };
    cart.push(item);
    saveCart();

}


function updateCart() {
    var products = document.querySelectorAll('.product-row');
    cart = [];
    // update Qty if product is already present
    for (i = 0; i < products.length; ++i) {
        var price = parseFloat(products[i].querySelectorAll('.pro-price span')[0].innerText.replace('$', ''));  // get selected product's price
        var name = products[i].querySelectorAll('.pro-title a')[0].innerText;  // get product name
        var qty = parseInt(products[i].querySelectorAll('input[name=qty]')[0].value);  // get quantity
        var image = products[i].getElementsByTagName('img')[0].src;  // get product name
        var item = { Product: name,  Price: price, Qty: qty, Image:image };
        cart.push(item);
    }
    saveCart();
    showCart();
    showCartPage();
}
