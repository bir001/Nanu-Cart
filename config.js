/* ===== EDIT YOUR DETAILS HERE ===== */
const CFG = {
  tagline: "Everything you need, in one cart",
  wa: "919999999999",            // WhatsApp number with country code, no +
  cc: "91",                      // country code (used for customer call/WhatsApp links)
  adminEmail: "admin@nanucart.com", // admin login email (create the same user in Firebase)
  insta: "https://instagram.com/",
  fb: "https://facebook.com/",
  img: {
    hero: "",                    // optional big banner image link on Home
    logo: "https://i.ibb.co/pBYqTsyS/nanucart-icon.png",
    logoFull: "https://i.ibb.co/5VRq3Kv/nanucart-logo.png"
  },
  /* Paste your Firebase web app config here (see setup steps) */
  firebase: { apiKey: "PASTE_API_KEY", authDomain: "", projectId: "", appId: "" },

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
