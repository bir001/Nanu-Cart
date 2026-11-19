/* ===== YAHAN APNI DETAILS BADLO ===== */
const CFG = {
  tagline: "Aapki zaroorat, ek hi cart mein",
  wa: "919999999999",          // WhatsApp number: country code ke saath, bina + ke
  insta: "https://instagram.com/",
  fb: "https://facebook.com/",

  /* Images: upload karke link yahan paste karo. Khaali "" chhodoge to placeholder dikhega */
  img: {
    hero: "",        // Home page ka bada banner
    logo: "https://i.ibb.co/pBYqTsyS/nanucart-icon.png",        // Header ka chhota logo (sirf icon). Khaali = icon nahi dikhega
    logoFull: "https://i.ibb.co/5VRq3Kv/nanucart-logo.png",  // Naam wala poora logo (footer me dikhta hai)
  },

  /* Products: apne products se replace karo. img = image ka link */
  products: [
    {id:"p1", name:"Product One",   cat:"Daily Needs", price:499, mrp:699,  img:""},
    {id:"p2", name:"Product Two",   cat:"Daily Needs", price:299, mrp:299,  img:""},
    {id:"p3", name:"Product Three", cat:"Gadgets",     price:1299,mrp:1799, img:""},
    {id:"p4", name:"Product Four",  cat:"Gadgets",     price:799, mrp:999,  img:""},
    {id:"p5", name:"Product Five",  cat:"Home",        price:599, mrp:799,  img:""},
    {id:"p6", name:"Product Six",   cat:"Home",        price:349, mrp:449,  img:""}
  ],

  /* Services: price = shuruaati keemat */
  services: [
    {id:"s1", name:"Service One",   price:299, desc:"Yahan service ki chhoti si jaankari likho.", img:""},
    {id:"s2", name:"Service Two",   price:499, desc:"Yahan service ki chhoti si jaankari likho.", img:""},
    {id:"s3", name:"Service Three", price:799, desc:"Yahan service ki chhoti si jaankari likho.", img:""}
  ]
};
