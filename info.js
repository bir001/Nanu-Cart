/* INFO PAGES: About, Contact, Privacy, Terms, Returns. Edit the text below anytime. */
const INFO={
 about:['About Us',['Nanu Cart is one place to order products and book services. Create an account, place your order, track it live and chat with our team whenever you need help.']],
 privacy:['Privacy Policy',['When you create an account or place an order, we collect your name, mobile number, address and order details.','We use this information only to process your orders and bookings and to contact you about them.','Your password is stored securely and is never visible to us.','To remove your account or data, contact us on WhatsApp or chat.']],
 terms:['Terms & Conditions',['By using Nanu Cart you agree to give correct details when you order or book.','Prices and availability can change. We may contact you on your registered mobile number to confirm orders and bookings.','We may cancel an order if an item is unavailable or the details are incomplete.']],
 returns:['Returns & Refunds',['If an item arrives damaged or is not what you ordered, contact us with your Order ID through chat or WhatsApp as soon as possible.','We will review your request and guide you on the next steps.','For product warranty issues, use the Warranty Claim page.']]
};
const info=k=>{
  if(k==='contact')return `<div class="sh"><h2>Contact Us</h2></div><div class="card doc"><p>We are happy to help with orders, bookings and warranty claims.</p><div class="menu"><a href="https://wa.me/${CFG.wa}" target="_blank" rel="noopener">${I('chat',20)}WhatsApp</a><a href="#chat">${I('chat',20)}Chat on the website</a><a href="${esc(CFG.insta)}" target="_blank" rel="noopener">${I('instagram',20)}Instagram</a><a href="${esc(CFG.fb)}" target="_blank" rel="noopener">${I('facebook',20)}Facebook</a></div></div>`;
  const d=INFO[k];if(!d)return home();
  return `<div class="sh"><h2>${d[0]}</h2></div><div class="card doc">${d[1].map(p=>`<p>${p}</p>`).join('')}</div>`};
