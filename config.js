/* ===== EDIT YOUR DETAILS HERE ===== */
const CFG = {
  tagline: "Everything you need, in one cart",
  wa: "919076568175",            // WhatsApp number with country code, no +
  cc: "91",                      // country code (used for customer call/WhatsApp links)
  adminEmail: "admin@nanucart.com", // admin login email (create the same user in Firebase)
  insta: "https://www.instagram.com/nanucart",
  fb: "https://www.facebook.com/share/1FWxfdb1QQ/",
  img: {
    hero: "",                    // optional big banner image link on Home
    logo: "https://i.ibb.co/pBYqTsyS/nanucart-icon.png",
    logoFull: "https://i.ibb.co/5VRq3Kv/nanucart-logo.png"
  },
  deliveryFee: 0,                // delivery charge in rupees. 0 = Free delivery
  freeShipAbove: 0,              // free delivery above this order value (only used when deliveryFee > 0)
  /* Home page slider. Add or remove slides. img is optional (image link). */
  offers: [
    {k:"New on Nanu Cart", t:"Shop smart. Track every step.", s:"Order products and book services in one place.", c:"Shop now", h:"#products", img:""},
    {k:"Services", t:"Book a service in a few taps", s:"Pick a service, share your details and we will confirm.", c:"Book a service", h:"#services", img:""},
    {k:"Need help?", t:"Chat with our team anytime", s:"Ask about orders, products or warranty.", c:"Start chat", h:"#chat", img:""}
  ],
  /* Paste your Firebase web app config here (see setup steps) */
  firebase: {
    apiKey: "AIzaSyAw4sKt2YJzVJ5DjRXqp8on8gMWOCCOyEg",
    authDomain: "nanu-cart.firebaseapp.com",
    projectId: "nanu-cart",
    storageBucket: "nanu-cart.firebasestorage.app",
    messagingSenderId: "822343085679",
    appId: "1:822343085679:web:dd614a5ae95d87fdf1279a"
  },

  /* Sample products. Once you add real products in the admin panel, these are replaced automatically. */
  products: [
    {id:"p1", name:"Sample Product One",   cat:"Daily Needs", price:499,  mrp:699,  imgs:[], desc:"Product description goes here."},
    {id:"p2", name:"Sample Product Two",   cat:"Daily Needs", price:299,  mrp:299,  imgs:[], desc:"Product description goes here."},
    {id:"p3", name:"Sample Product Three", cat:"Gadgets",     price:1299, mrp:1799, imgs:[], desc:"Product description goes here."},
    {id:"p4", name:"Sample Product Four",  cat:"Gadgets",     price:799,  mrp:999,  imgs:[], desc:"Product description goes here."}
  ],
  services: [
    {id:"s1", name:"Service One",   price:299, desc:"A short description of this service.", img:""},
    {id:"s2", name:"Service Two",   price:499, desc:"A short description of this service.", img:""},
    {id:"s3", name:"Service Three", price:799, desc:"A short description of this service.", img:""}
  ]
};
