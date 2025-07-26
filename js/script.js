const products = [];
for(let i=1; i<=100; i++){
  products.push({
    id: i,
    name: `Product ${i}`,
    price: (Math.random()*90 + 10).toFixed(2),
    img: `https://picsum.photos/id/${i + 100}/300/300`
  });
}

let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const totalSpan = document.getElementById('cart-total');
const shipping = document.getElementById('shipping');
const couponCode = document.getElementById('coupon-code');

function renderProducts(){
  if (!productList) return;
  products.slice(0,12).forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="name">${p.name}</div>
      <div class="price">$${p.price}</div>
      <button class="main-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      <a href="checkout.html"><button class="main-btn">Order Now</button></a>
    `;
    productList.appendChild(div);
  });
}

function addToCart(id){
  const p = products.find(p => p.id === id);
  const found = cart.find(x => x.id === id);
  if(found){ found.qty++; }
  else { cart.push({ ...p, qty: 1 }); }
  saveCart();
  alert(`${p.name} added to cart`);
}

function saveCart(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart(){
  if(!cartItems) return;
  cartItems.innerHTML = '';
  if(cart.length === 0) cartItems.innerHTML = '<p>No items in cart.</p>';
  else {
    cart.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `${item.name} x ${item.qty} = $${(item.qty*item.price).toFixed(2)}`;
      cartItems.appendChild(div);
    });
  }
  updateTotal();
}

function updateTotal(){
  let total = cart.reduce((sum, x) => sum + x.qty*x.price, 0);
  total += parseFloat(shipping?.value || 0);
  totalSpan && (totalSpan.textContent = total.toFixed(2));
}

if(shipping){
  shipping.onchange = updateTotal;
}
if(document.getElementById('apply-coupon')){
  document.getElementById('apply-coupon').onclick = () => {
    if(couponCode.value === 'DISCOUNT10') {
      cart.forEach(x => x.price *= 0.9);
      saveCart(); renderCart();
      alert('Coupon applied!');
    } else alert('Invalid code');
  };
}

renderProducts();
renderCart();

