import { useState, useEffect, useRef, useCallback, useMemo, memo, createContext, useContext } from "react";
import {
  ShoppingBag, Search, Menu, X, User, Mail, Phone,
  Instagram, Twitter, Heart, ChevronUp,
  Star, Minus, Plus, ArrowRight, Check,
  Youtube, Play, Eye, Zap, Fingerprint
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

/* =======================
   PRODUCT DATA (YOUR DATA)
======================= */
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  tagline: string;
}

export const PRODUCTS: Product[] = [
  // ——— Jerseys & Kits
  {
    id: 1,
    name: "CR7 Al Nassr Home Tribute Jersey",
    category: "Kits & Apparel",
    price: 12500,
    image: "https://imgs.search.brave.com/hANtVCQvgmHkadKeCbS2JXPi0Nak7qmflO7JrQ_MrWo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jYW1w/ZW9uc3BvcnRzLmNv/bS9jZG4vc2hvcC9m/aWxlcy9JTUctMjAy/NDEwMTctV0EwNTYy/LmpwZz92PTE3Mjkx/NjMxNzEmd2lkdGg9/MjIyOA",
    tagline: "RONALDO #7 Home Tribute",
  },
  {
    id: 2,
    name: "CR7 Al Nassr Away Tribute Jersey",
    category: "Kits & Apparel",
    price: 12300,
    image: "https://imgs.search.brave.com/WE0xqL0AAPAx8tGoME89sT4VCMqxMMV3s-Ohk2duOQ8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91LW1l/cmNhcmktaW1hZ2Vz/Lm1lcmNkbi5uZXQv/cGhvdG9zL20yMDE1/NjY4MjE4N18xLmpw/Zz93aWR0aD0xMjgw/JnF1YWxpdHk9NzUm/Xz0xNzYyMTk3ODk3",
    tagline: "RONALDO #7 Away Tribute",
  },
  {
    id: 3,
    name: "CR7 Portugal Home Tribute Jersey",
    category: "Kits & Apparel",
    price: 13000,
    image: "https://imgs.search.brave.com/2dwI7ach5kvbUDckrZM3R-FzBLAvUyQN1buIf7aVq1k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9idWNr/ZXQtcmV2ZXRlZS5z/dG9yYWdlLmdvb2ds/ZWFwaXMuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI2LzAx/LzEyMDcyMjU5L0Ny/aXN0aWFuby1Sb25h/bGRvLVBvcnR1Z2Fs/LUplcnNleS0yMDI2/LUNyNy1OdW1iZXIt/Ny1Tb2NjZXItU2hp/cnQtRmFuLUVkaXRp/b24tdHJlbmRpbmdu/b3dlXzIuanBn",
    tagline: "RONALDO #7 Portugal Style",
  },
  {
    id: 4,
    name: "CR7 Portugal Away Tribute Jersey",
    category: "Kits & Apparel",
    price: 12800,
    image: "https://imgs.search.brave.com/rjqCuxL6nNY-4zMi1n9eAYLsU_SN4sWTJh5GsaM3a1A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL1JlUUFB/ZVN3YXdCcEJRekMv/cy1sNTAwLndlYnA",
    tagline: "RONALDO #7 Away Fan Edition",
  },
  {
    id: 5,
    name: "CR7 Legacy Black Jersey",
    category: "Kits & Apparel",
    price: 13500,
    image: "https://imgs.search.brave.com/xG72OsguQazXn8GS4Ud9C-hP_Ix1h68t07i_BpchRqQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aGVq/ZXJzZXljdWx0dXJl/LmNvbS9jZG4vc2hv/cC9maWxlcy9jcmlz/dGlhbm8tcm9uYWxk/by1tYW5jaGVzdGVy/LXVuaXRlZC0yMDA3/LTIwMDgtYmxhY2st/bG9uZy1zbGVldmUt/YWlnLXNwb25zb3It/a2l0LWplcnNleS1t/YWlsbG90LXRyaWtv/dC1iYWNrLmpwZz92/PTE3NDY0OTQ3NTMm/d2lkdGg9MTk0Ng",
    tagline: "Limited Black #7 Edition",
  },
  {
    id: 6,
    name: "CR7 Champions Gold Jersey",
    category: "Kits & Apparel",
    price: 14200,
    image: "https://imgs.search.brave.com/YglKJMoQaFvu4GweASy6l92lfkV1agYeoRuCO3gxmlQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9mb290/YmFsbHBhdGNoa2lu/Zy5jb20vY2RuL3No/b3AvZmlsZXMvSU1H/XzgyMjJfNTMweEAy/eC5wbmc_dj0xNzI3/MTYzNjkz",
    tagline: "CR7 Gold Champions League Jersey",
  },
  {
    id: 7,
    name: "CR7 Street Edition Jersey",
    category: "Kits & Apparel",
    price: 11900,
    image: "https://imgs.search.brave.com/U3nvgKfBmebb3DkIsTOuTFhWdDkUTRlHLIpiyuYa8Vg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzQ0MDU1NjE1L3Iv/aWwvZTYzZjNhLzY3/NTMzNzQ5MDQvaWxf/MzAweDMwMC42NzUz/Mzc0OTA0XzJ2Y2Qu/anBn",
    tagline: "Urban Street Style #7",
  },
  {
    id: 8,
    name: "CR7 Red Devil Style Jersey",
    category: "Kits & Apparel",
    price: 12600,
    image: "https://imgs.search.brave.com/1_pF0Bzgc8eMXxfw4rf_PfJMmtqv_yp1WMyM5m7knhI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jeWJl/cnJpZWRzdG9yZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjUvMDkvQ3I3LW11/ZmMtbnVtYmVyLTct/cHJpbnRlZC1qZXJz/ZXktcmVkLWJhY2st/MzAweDMwMC5wbmc",
    tagline: "Classic Retro Tribute",
  },
  // ——— Hoodies & Tops
  {
    id: 9,
    name: "CR7 Signature Hoodie – Black",
    category: "Hoodies",
    price: 8500,
    image: "https://imgs.search.brave.com/rvjYtHv5pvRcANNxUN4QcWWTPfbNme3RZDIfs2sRRiU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzI1MTcwODMzL3Iv/aWwvYzcxOWZiLzMw/NDA1MTc5MjUvaWxf/MzAweDMwMC4zMDQw/NTE3OTI1X3Jod24u/anBn",
    tagline: "Premium GOAT Hoodie",
  },
  {
    id: 10,
    name: "CR7 Signature Hoodie – Grey",
    category: "Hoodies",
    price: 8300,
    image: "https://imgs.search.brave.com/dJHd_rNLTb1osFyOn1cawm4pVQzrt_Yufy3qbC1XDZ8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudmlyYWxkZXMu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI0LzA4L2NyaXN0/aWFuby1yb25hbGRv/LWNyNy1zaWduYXR1/cmVzLWhvb2RpZS0x/LWt6bm53LmpwZw",
    tagline: "Soft Grey Comfort Hoodie",
  },
  {
    id: 11,
    name: "CR7 Training Hoodie",
    category: "Hoodies",
    price: 8700,
    image: "https://imgs.search.brave.com/GfWb4aj5IfWIOz4XThq5bClmd1XqD1FdvmBZ9aWvFK8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/YW1lcmljYWphY2tl/dHMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDI0LzA4L1Bv/cnR1Z2FsLUNyaXN0/aWFuby1Sb25hbGRv/LUhvb2RpZS0yNjV4/MzUzLndlYnA",
    tagline: "Active Training Fit",
  },
  {
    id: 12,
    name: "CR7 Street Hoodie",
    category: "Hoodies",
    price: 8200,
    image: "https://imgs.search.brave.com/fqU6kd06YQmCm6h6392d1X89-JXc-3AfVgMG-rpWTFQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFrSnJxWlRYUUwu/anBn",
    tagline: "Urban Streetwear",
  },
  {
    id: 13,
    name: "CR7 Legacy Zip Hoodie",
    category: "Hoodies",
    price: 8900,
    image: "https://imgs.search.brave.com/wsm4aUU6VvjCXk0t_fVBt2xwKW9lG6oOFjA1trl7R38/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cHJpbnRibHVyLmNv/bS91bnNhZmUvNTQw/eDU0MC9hc3NldHMu/cHJpbnRibHVyLmNv/bS8yMDI1LzAxLzEz/L3NjcmVlbnNob3Qt/MTQyLWJkNWUzMDM4/OTg5Y2NmNDI2NWEy/ODRjMTkwNTkyODVl/LnBuZw",
    tagline: "Zip Style Comfort",
  },
  {
    id: 14,
    name: "CR7 Minimal Logo Sweatshirt",
    category: "Hoodies",
    price: 7900,
    image: "https://imgs.search.brave.com/0YzNfo-wspuLpcHeXT_Rfox2j3sUJ5y6s0KhTauPLwc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9paDEu/cmVkYnViYmxlLm5l/dC9pbWFnZS4yNjYw/MTM3NTU1LjM1NTEv/c3NyY28sb3ZlcnNp/emVkX3N3ZWF0c2hp/cnQsbWVuc18wMSxl/OGU2ZTE6YWE4ZmZk/OWYwZixmcm9udCxz/cXVhcmVfcHJvZHVj/dCx4NjAwLmpwZw",
    tagline: "Clean Minimalist Fit",
  },
  // ——— Footwear
  {
    id: 15,
    name: "CR7 Speed Pro Football Boots",
    category: "Footwear",
    price: 16500,
    image: "https://imgs.search.brave.com/K33jKcOzQfu8MGAXIHMHEZZScDSn6jkZZOrIrSFGMGM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c29jY2VyYmlibGUu/Y29tL21lZGlhLzky/ODMxL2NyNy1zZS10/YWIuanBn",
    tagline: "Designed for explosive speed",
  },
  {
    id: 16,
    name: "CR7 Power Strike Football Boots",
    category: "Footwear",
    price: 17000,
    image: "https://imgs.search.brave.com/K33jKcOzQfu8MGAXIHMHEZZScDSn6jkZZOrIrSFGMGM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c29jY2VyYmlibGUu/Y29tL21lZGlhLzky/ODMxL2NyNy1zZS10/YWIuanBn",
    tagline: "Powerful kick, maximum comfort",
  },
  {
    id: 17,
    name: "CR7 Indoor Court Shoes",
    category: "Footwear",
    price: 12000,
    image: "https://imgs.search.brave.com/JCHTufRCn0L91jgCoN3K_V07v-yrhmoYZjHcRTvCFdg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzdmLzE0/LzU4LzdmMTQ1ODI2/YzY5MGM2NWZhNGJj/NGEzNmM0NjdhOGZj/LmpwZw",
    tagline: "Indoor agility & grip",
  },
  {
    id: 18,
    name: "CR7 Lifestyle Sneakers",
    category: "Footwear",
    price: 14500,
    image: "https://imgs.search.brave.com/0wMZq8ea7rnm7vQCgB-dmnExU-pR4xfBf-UEr6JpPJk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzM5Mzc2MjU0L3Iv/aWwvZTcwZjViLzU2/OTc0OTMwMzEvaWxf/MzAweDMwMC41Njk3/NDkzMDMxX3M1YTYu/anBn",
    tagline: "Casual everyday style",
  },
  {
    id: 19,
    name: "CR7 Training Runners",
    category: "Footwear",
    price: 13800,
    image: "https://imgs.search.brave.com/p4qriK5q8fGpypp-kwoK5pLZ_uyOond3iG2du9rZmR8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDI4NTll/YTQ4NjlkMTQ2ODc4/MWFlZGI0YzkxNDBj/ODdkUy5wbmdfMzAw/eDMwMC5qcGc",
    tagline: "Training & gym performance",
  },
  // ——— Fragrances & Grooming
  {
    id: 20,
    name: "CR7 Legacy Perfume",
    category: "Fragrances",
    price: 10500,
    image: "https://cr7fragrances.store/cdn/shop/files/Legacy100ml_600x.png?v=1740492399",
    tagline: "CRISTIANO RONALDO LEGACY EAU DE PARFUM",
  },
  {
    id: 21,
    name: "CR7 Play It Cool Perfume",
    category: "Fragrances",
    price: 7000,
    image: "https://cr7fragrances.store/cdn/shop/products/DSC6531_final_600x.jpg?v=1675093385",
    tagline: "CR7 Play It Cool Eau De Toilette",
  },
  {
    id: 22,
    name: "Cristiano Ronaldo Discover",
    category: "Fragrances",
    price: 7700,
    image: "https://cr7fragrances.store/cdn/shop/files/Cr7-Discover-100ml-2_600x.jpg?v=1731923465",
    tagline: "CRISTIANO RONALDO DISCOVER EAU DE TOILETTE 100ML GIFT SET",
  },
  {
    id: 23,
    name: "Cristiano Ronaldo Fearless",
    category: "Fragrances",
    price: 7500,
    image: "https://cr7fragrances.store/cdn/shop/files/CristianoRonaldoFearless30ml_600x.jpg?v=1689753222",
    tagline: "CRISTIANO RONALDO FEARLESS EAU DE TOILETTE",
  },
  {
    id: 24,
    name: "Cristiano Ronaldo Origins",
    category: "Fragrances",
    price: 7800,
    image: "https://cr7fragrances.store/cdn/shop/files/FREE_1_600x.png?v=1698928437",
    tagline: "Cristiano Ronaldo Origins Eau de Toilette 30ml Bundle",
  },
  {
    id: 25,
    name: "CR7 Body Spray & Shower Set",
    category: "Fragrances",
    price: 5000,
    image: "https://cr7fragrances.store/cdn/shop/files/CR7GIFTSET100ML2_600x.jpg?v=1700063821",
    tagline: "CR7 100ML EAU DE TOILETTE, SHOWER GEL & BODY SPRAY GIFT SET",
  },
  // ——— Eyewear & Accessories
  {
    id: 26,
    name: "CR7 Sunglasses – Sport Edition",
    category: "Eyewear",
    price: 15000,
    image: "https://avvenice.com/96947-home_default/cr7-cristiano-ronaldo-bd002-black-frame-sunglasses-exclusive-official-collection-cr7-eyewear.jpg",
    tagline: "Sporty sun protection",
  },
  {
    id: 27,
    name: "CR7 Sunglasses – Lifestyle Edition",
    category: "Eyewear",
    price: 9000,
    image: "https://s.yimg.com/ny/api/res/1.2/NHLQD6mvyT8Dsj4FMAh3iA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTIwMDA7aD0xMTI0O2NmPXdlYnA-/https://media.zenfs.com/en/robb_report_967/c2f7a0f70af6e1b8285111f35e008cff",
    tagline: "Cool urban look",
  },
  {
    id: 28,
    name: "CR7 Cap",
    category: "Accessories",
    price: 1500,
    image: "https://ih1.redbubble.net/image.4664877852.5914/ssrco,baseball_cap,product,161D36:1628f0f39d,front,square,600x600-bg,f8f8f8.jpg",
    tagline: "CR7 Al Nassr Cap",
  },
  {
    id: 29,
    name: "CR7 Training Socks Pack",
    category: "Accessories",
    price: 1500,
    image: "https://cr7us.com/cdn/shop/files/8190-80-9000.png?v=1743444072&width=1200",
    tagline: "Sporty comfort",
  },
  {
    id: 30,
    name: "CR7 Gym Bag",
    category: "Accessories",
    price: 6200,
    image: "https://imgs.search.brave.com/v8xBfjoeildCO8CSlLLa4cL9U-balQ3B5BJwjQB4ysg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWc0/LmRocmVzb3VyY2Uu/Y29tLzYwMHg2MDAvZjMvYWxidS9qYy9zLzA3L2U3OTFlYjNmLTgxN2ItNGVhNy05MjVhLWY5ZmY0NjQ4YmY1NC5qcGc",
    tagline: "All‑in‑one gear bag",
  },
  {
    id: 31,
    name: "CR7 Leather Belt",
    category: "Accessories",
    price: 4300,
    image: "https://imgs.search.brave.com/LEwy8UMOg4hWplKJNc3y7rgbQCXGEEnCkOO5MGB4vj8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFTSHdDMEhZT0wu/anBn",
    tagline: "Classic leather accessory",
  },
  {
    id: 32,
    name: "CR7 Wristband Set",
    category: "Accessories",
    price: 3221,
    image: "https://m.media-amazon.com/images/I/71ODTz-RMmL._AC_SY535_.jpg",
    tagline: "Sport & style combo",
  },
  // ——— Posters & Collectibles
  {
    id: 33,
    name: "CR7 Legacy Portrait Art",
    category: "Collectibles",
    price: 2800,
    image: "https://i.ebayimg.com/images/g/EuAAAeSwGzRokyKY/s-l500.webp",
    tagline: "Iconic wall art",
  },
  {
    id: 34,
    name: "CR7 Champions Wall Art",
    category: "Collectibles",
    price: 3200,
    image: "https://i.ebayimg.com/images/g/LywAAeSwIDxpL--g/s-l500.webp",
    tagline: "Champions league art",
  },
  {
    id: 35,
    name: "CR7 Minimalist Number 7 Print",
    category: "Collectibles",
    price: 2400,
    image: "https://www.sportscaveshop.com/cdn/shop/files/CristianoRonaldoBlack.jpg?v=1699152029&width=480",
    tagline: "Portugal number 7",
  },
  {
    id: 36,
    name: "CR7 Motivational Quote Frame",
    category: "Collectibles",
    price: 2600,
    image: "https://www.sportscaveshop.com/cdn/shop/files/unframed-cristiano-ronaldo-motivational-sport-art.jpg?v=1746406678&width=5000",
    tagline: "Motivation for your space",
  },
  // ——— Bonus Items
  {
    id: 37,
    name: "CR7 Bathrobe",
    category: "Kits & Apparel",
    price: 2000,
    image: "https://cdn.faire.com/fastly/82490d3f9720fc1a5fa13da3f37599877b789fc875aa9ff824aefec7f9085f9e.jpeg?bg-color=FFFFFF&canvas=360:360&dpr=1&fit=bounds&format=jpg&height=360&width=360",
    tagline: "Classy Bathrobe",
  },
  {
    id: 38,
    name: "CR7 Custom Watch",
    category: "Accessories",
    price: 24500000,
    image: "https://cxlcntsfta.cloudimg.io/https://d2j6dbq0eux0bg.cloudfront.net/images/16115183/4334436363?q=95&w=750&h=750&func=fit&bg_colour=white",
    tagline: "Cristiano Ronaldo's Custom Jacob & Co. Watch Collection",
  },
  {
    id: 39,
    name: "CR7 Beddings",
    category: "Kits & Apparel",
    price: 5000,
    image: "https://www.ebuycos.com/cdn/shop/files/CR7CristianoRonaldoBeddingSetPatternQuiltDuvetCover_15_873bab75-9f18-40c0-ba6f-a79766599475_1024x1024.jpg?v=1694763982",
    tagline: "CR7 Cristiano Ronaldo Bedding Set Duvet Cover",
  },
  {
    id: 40,
    name: "CR7 Signed Jersey",
    category: "Collectibles",
    price: 65000,
    image: "https://i.ebayimg.com/images/g/nEQAAeSwmvdpkz7f/s-l960.webp",
    tagline: "Cristiano Ronaldo framed Hand Signed jersey",
  },
];

/* =======================
   TYPES
======================= */
interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface CursorContextType {
  cursorText: string;
  setCursorText: (text: string) => void;
  cursorVariant: string;
  setCursorVariant: (variant: string) => void;
}

/* =======================
   CONTEXT
======================= */
const CursorContext = createContext<CursorContextType>({
  cursorText: "",
  setCursorText: () => {},
  cursorVariant: "default",
  setCursorVariant: () => {},
});

/* =======================
   CATEGORY CONFIG
======================= */
const CATEGORY_ORDER = [
  { name: "Fragrances", bg: "#0a1a33", icon: "🧴", accent: "#60a5fa" },
  { name: "Kits & Apparel", bg: "#0b0b0b", icon: "👕", accent: "#f59e0b" },
  { name: "Collectibles", bg: "#1a0f05", icon: "🏆", accent: "#fbbf24" },
  { name: "Eyewear", bg: "#111111", icon: "🕶️", accent: "#a78bfa" },
  { name: "Footwear", bg: "#1c0c18", icon: "👟", accent: "#f472b6" },
  { name: "Hoodies", bg: "#0f0f0f", icon: "🧥", accent: "#34d399" },
  { name: "Accessories", bg: "#151515", icon: "⌚", accent: "#fb923c" },
];

/* =======================
   CUSTOM CURSOR
======================= */
const CustomCursor = memo(() => {
  const { cursorText, cursorVariant } = useContext(CursorContext);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: -100, y: -100 });
  const trailPosition = useRef({ x: -100, y: -100 });

  useEffect(() => {
    let animationId: number;

    const updateCursor = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (cursorRef.current && trailRef.current) {
        cursorRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) translate(-50%, -50%)`;
        trailPosition.current.x += (position.current.x - trailPosition.current.x) * 0.15;
        trailPosition.current.y += (position.current.y - trailPosition.current.y) * 0.15;
        trailRef.current.style.transform = `translate3d(${trailPosition.current.x}px, ${trailPosition.current.y}px, 0) translate(-50%, -50%)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", updateCursor, { passive: true });
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const cursorSize = useMemo(() => {
    switch (cursorVariant) {
      case "text": return { width: 100, height: 100 };
      case "button": return { width: 60, height: 60 };
      default: return { width: 16, height: 16 };
    }
  }, [cursorVariant]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile('ontouchstart' in window || window.innerWidth < 768);
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center transition-all duration-150"
        style={{
          width: cursorSize.width,
          height: cursorSize.height,
          background: cursorVariant === "text" ? "rgba(255,255,255,0.9)" :
                      cursorVariant === "button" ? "rgba(245,158,11,0.8)" :
                      "transparent",
          border: cursorVariant === "default" ? "1px solid rgba(255,255,255,0.4)" : "none",
          mixBlendMode: cursorVariant === "text" ? "difference" : "normal",
          willChange: "transform, width, height",
        }}
      >
        {cursorText && (
          <span className="text-black text-xs font-bold uppercase tracking-wider">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
});

/* =======================
   GLITCH TEXT
======================= */
const GlitchText = memo(({ children, className }: { children: string; className?: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 w-full h-full text-cyan-500 opacity-70"
            style={{ transform: "translate(-2px, -1px)", clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
          >
            {children}
          </span>
          <span
            className="absolute top-0 left-0 w-full h-full text-red-500 opacity-70"
            style={{ transform: "translate(2px, 1px)", clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)" }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
});

/* =======================
   CYBER BUTTON
======================= */
const CyberButton = memo(({ children, onClick, className, type = "button" }: any) => {
  const { setCursorVariant } = useContext(CursorContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onMouseEnter={() => { setIsHovered(true); setCursorVariant("button"); }}
      onMouseLeave={() => { setIsHovered(false); setCursorVariant("default"); }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "0%" : "-100%" }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/50" />
      <span className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-white text-sm">
        {children}
      </span>
    </motion.button>
  );
});

/* =======================
   HOLOGRAPHIC CARD
======================= */
const HolographicCard = memo(({ children, className, onClick }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const { setCursorVariant, setCursorText } = useContext(CursorContext);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTransform({ rotateX: (y - 0.5) * -15, rotateY: (x - 0.5) * 15 });
    setGlarePosition({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setCursorVariant("default");
    setCursorText("");
  }, [setCursorVariant, setCursorText]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setCursorVariant("text"); setCursorText("View"); }}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ rotateX: transform.rotateX, rotateY: transform.rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={`relative cursor-pointer ${className}`}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-50"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
        }}
      />
      <div
        className="absolute -inset-[1px] rounded-2xl z-10 opacity-60"
        style={{
          background: `linear-gradient(${90 + transform.rotateY * 2}deg, #f59e0b, #ef4444, #8b5cf6, #06b6d4, #f59e0b)`,
          backgroundSize: "200% 200%",
        }}
      />
      <div className="relative z-10 bg-zinc-900/95 rounded-2xl overflow-hidden m-[1px]">
        {children}
      </div>
    </motion.div>
  );
});

/* =======================
   ANIMATED BACKGROUND
======================= */
const AnimatedBackground = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)", top: "20%", left: "-10%" }}
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-15"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)", bottom: "10%", right: "-10%" }}
        animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-10"
        style={{ background: "radial-gradient(circle, #ef4444, transparent)", top: "50%", left: "50%" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </div>
  );
});

/* =======================
   LOADING SCREEN
======================= */
const LoadingScreen = memo(({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const newProgress = Math.min(p + Math.random() * 12 + 3, 100);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
        }
        return newProgress;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      <motion.div
        className="absolute w-[400px] h-[400px] border border-amber-500/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] border border-amber-500/30 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative z-10">
        <GlitchText className="text-7xl md:text-8xl font-black italic bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          CR7
        </GlitchText>
      </motion.div>
      <div className="relative z-10 mt-12 w-64">
        <div className="flex justify-between text-xs text-amber-500 mb-2 font-mono">
          <span>LOADING</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
});

/* =======================
   NAVBAR
======================= */
const Navbar = memo(({ cartCount, toggleCart, onAuthClick, onSearchClick }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setCursorVariant, setCursorText } = useContext(CursorContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-300 ${scrolled ? "top-4" : "top-6"}`}
      >
        <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3">
          <motion.div
            className="absolute inset-0 rounded-full opacity-50"
            style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)", backgroundSize: "200% 100%" }}
            animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative flex items-center justify-between">
            <motion.a
              href="#"
              className="text-2xl font-black italic"
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => { setCursorVariant("text"); setCursorText("Home"); }}
              onMouseLeave={() => { setCursorVariant("default"); setCursorText(""); }}
            >
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">CR7</span>
            </motion.a>
            <div className="hidden lg:flex items-center gap-6">
              {CATEGORY_ORDER.map((c) => (
                <a key={c.name} href={`#${c.name.replace(/\s+/g, "-")}`} className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors">
                  {c.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onSearchClick} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <Search size={18} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onAuthClick} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <User size={18} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleCart} className="relative w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center">
                <Menu size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col">
            <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center border border-white/20 rounded-full hover:bg-white/10 transition-colors">
              <X size={24} />
            </button>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {CATEGORY_ORDER.map((c, i) => (
                <motion.a
                  key={c.name}
                  href={`#${c.name.replace(/\s+/g, "-")}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl md:text-5xl font-black italic uppercase text-white/40 hover:text-white transition-colors"
                >
                  {c.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

/* =======================
   HERO
======================= */
const Hero = memo(() => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const { setCursorVariant } = useContext(CursorContext);

  return (
    <motion.section style={{ opacity }} className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <motion.img style={{ y }} src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920" alt="Hero" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-8">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full" />
          <span className="text-amber-500 font-mono text-sm tracking-[0.4em] uppercase">Official Store</span>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} onMouseEnter={() => setCursorVariant("text")} onMouseLeave={() => setCursorVariant("default")}>
          <GlitchText className="text-[12vw] md:text-[10vw] font-black italic leading-[0.9] tracking-tight">LEGACY</GlitchText>
          <h1 className="text-[12vw] md:text-[10vw] font-black italic leading-[0.9] tracking-tight" style={{ WebkitTextStroke: "2px rgba(245,158,11,0.4)", color: "transparent" }}>DEFINED</h1>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 text-white/40 tracking-[0.3em] uppercase text-sm font-mono">Elite performance • Elite lifestyle</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-col sm:flex-row gap-4 mt-12">
          <CyberButton>
            <Zap size={18} />
            <span>Shop Now</span>
            <ArrowRight size={18} />
          </CyberButton>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-3 border border-white/20 px-8 py-4 font-bold uppercase text-sm hover:bg-white/5 transition-all">
            <Play size={18} />
            <span>Watch Film</span>
          </motion.button>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <motion.div className="w-1 h-2 bg-amber-500 rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
});

/* =======================
   MARQUEE
======================= */
const MarqueeSection = memo(() => (
  <section className="py-6 bg-gradient-to-r from-amber-500/5 via-red-500/5 to-purple-500/5 border-y border-white/5 overflow-hidden">
    <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center gap-16 px-8 text-4xl md:text-6xl font-black italic text-white/5">
          <span>LEGENDARY</span><span className="text-amber-500/20">⬥</span><span>CHAMPION</span><span className="text-amber-500/20">⬥</span><span>ICONIC</span><span className="text-amber-500/20">⬥</span><span>GOAT</span><span className="text-amber-500/20">⬥</span>
        </div>
      ))}
    </motion.div>
  </section>
));

/* =======================
   STATS
======================= */
const StatsSection = memo(() => {
  const stats = [
    { value: "5+", label: "Ballon d'Or", icon: "🏆" },
    { value: "900+", label: "Career Goals", icon: "⚽" },
    { value: "200+", label: "Int'l Goals", icon: "🌍" },
    { value: "∞", label: "Legacy", icon: "👑" },
  ];

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
            <span className="text-3xl mb-2 block">{stat.icon}</span>
            <span className="text-4xl md:text-6xl font-black bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">{stat.value}</span>
            <p className="text-white/40 uppercase tracking-wider text-xs mt-2 font-mono">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

/* =======================
   PRODUCT CARD
======================= */
const ProductCard = memo(({ product, index, onAdd, onQuickView }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HolographicCard onClick={() => onQuickView(product)}>
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
            onError={(e: any) => {
              e.target.src = "https://via.placeholder.com/400x500?text=CR7";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-red-500 text-black text-[10px] font-black px-3 py-1 uppercase">New</span>
          <motion.div className="absolute top-3 right-3 flex flex-col gap-2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}>
            <button className="w-9 h-9 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all">
              <Heart size={14} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="w-9 h-9 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-all">
              <Eye size={14} />
            </button>
          </motion.div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (<Star key={star} size={10} className="fill-amber-500 text-amber-500" />))}
            <span className="text-[10px] text-white/40 ml-1 font-mono">(128)</span>
          </div>
          <h3 className="text-lg font-black italic uppercase mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3 font-mono line-clamp-1">{product.tagline}</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black">
              <span className="text-white/40 text-xs font-mono">KSH</span> {formatPrice(product.price)}
            </p>
            <CyberButton onClick={(e: any) => { e.stopPropagation(); onAdd(product); }} className="text-xs py-2 px-4">Add</CyberButton>
          </div>
        </div>
      </HolographicCard>
    </motion.div>
  );
});

/* =======================
   CATEGORY SECTION
======================= */
const CategorySection = memo(({ category, products, onAdd, onQuickView }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id={category.name.replace(/\s+/g, "-")} className="relative py-24 px-6" style={{ backgroundColor: category.bg }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(${category.accent}40 1px, transparent 1px), linear-gradient(90deg, ${category.accent}40 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <span className="text-5xl mb-4 block">{category.icon}</span>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase"><GlitchText>{category.name}</GlitchText></h2>
          <p className="text-white/40 mt-4 font-mono text-sm">Discover our exclusive {category.name.toLowerCase()} collection</p>
        </motion.div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p: Product, i: number) => (<ProductCard key={p.id} product={p} index={i} onAdd={onAdd} onQuickView={onQuickView} />))}
        </div>
      </div>
    </section>
  );
});

/* =======================
   TESTIMONIALS
======================= */
const TestimonialsSection = memo(() => {
  const testimonials = [
    { quote: "The quality is absolutely insane. True champion merchandise!", author: "Carlos M.", location: "Madrid" },
    { quote: "Fast shipping, premium quality. This is the real deal.", author: "Sarah K.", location: "Nairobi" },
    { quote: "Best football merchandise I've ever purchased.", author: "James O.", location: "London" },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-black relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-amber-500 uppercase tracking-[0.3em] text-xs mb-8 font-mono">⬥ Testimonials ⬥</p>
        <div className="relative min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="absolute">
              <p className="text-2xl md:text-4xl font-black italic leading-tight mb-6">"{testimonials[current].quote}"</p>
              <p className="text-white/40 font-mono"><span className="text-amber-500">{testimonials[current].author}</span> — {testimonials[current].location}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`w-10 h-1 rounded-full transition-all ${i === current ? "bg-amber-500" : "bg-white/20"}`} />))}
        </div>
      </div>
    </section>
  );
});

/* =======================
   NEWSLETTER
======================= */
const NewsletterSection = memo(() => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="text-amber-500 uppercase tracking-[0.3em] text-xs mb-4 font-mono">⬥ Newsletter ⬥</p>
        <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-8"><GlitchText>Join the Legacy</GlitchText></h2>
        <p className="text-white/40 mb-10 font-mono text-sm">Subscribe for exclusive drops & 15% off your first order</p>
        {subscribed ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-3 text-green-400">
            <Check size={28} /><span className="text-xl font-bold font-mono">Welcome to the squad!</span>
          </motion.div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-center sm:text-left focus:outline-none focus:border-amber-500 transition-colors font-mono" />
            <CyberButton type="submit"><Zap size={16} />Subscribe</CyberButton>
          </form>
        )}
      </div>
    </section>
  );
});

/* =======================
   FOOTER
======================= */
const Footer = memo(() => (
  <footer className="bg-black border-t border-white/5 py-16 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
        <div className="lg:w-1/3">
          <h3 className="text-5xl font-black italic mb-4"><GlitchText className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">CR7</GlitchText></h3>
          <p className="text-white/40 mb-6 font-mono text-sm">The official lifestyle store for champions. Premium merchandise inspired by greatness.</p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <motion.a key={i} href="#" whileHover={{ scale: 1.1, y: -2 }} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-all">
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-amber-500 font-mono">Shop</h4>
            <ul className="space-y-2 text-white/40 font-mono text-sm">
              {CATEGORY_ORDER.slice(0, 4).map((c) => (<li key={c.name}><a href={`#${c.name.replace(/\s+/g, "-")}`} className="hover:text-white transition-colors">{c.name}</a></li>))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-amber-500 font-mono">Support</h4>
            <ul className="space-y-2 text-white/40 font-mono text-sm">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-amber-500 font-mono">Contact</h4>
            <ul className="space-y-2 text-white/40 font-mono text-sm">
              <li className="flex items-center gap-2"><Mail size={12} /> support@cr7store.com</li>
              <li className="flex items-center gap-2"><Phone size={12} /> +254 700 123 456</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs font-mono">
        <p>© 2024 CR7 STORE. ALL RIGHTS RESERVED.</p>
        <p className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />SYSTEM OPERATIONAL</p>
      </div>
    </div>
  </footer>
));

/* =======================
   QUICK VIEW MODAL
======================= */
const QuickViewModal = memo(({ product, isOpen, onClose, onAddToCart }: any) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Reset when product changes
  useEffect(() => {
    setSelectedSize("");
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const formatPrice = (price: number) => price.toLocaleString();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center border border-white/10 hover:bg-white hover:text-black transition-all">
              <X size={18} />
            </button>
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square bg-zinc-800">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e: any) => { e.target.src = "https://via.placeholder.com/400x500?text=CR7"; }} />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-wider font-mono">{product.category}</span>
                <h2 className="text-3xl font-black italic uppercase mt-2 mb-2">{product.name}</h2>
                <p className="text-white/50 mb-4 font-mono text-sm">{product.tagline}</p>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (<Star key={star} size={14} className="fill-amber-500 text-amber-500" />))}
                  <span className="text-white/40 text-sm font-mono ml-2">(128)</span>
                </div>
                <p className="text-3xl font-black mb-6 font-mono"><span className="text-white/40 text-sm">KSH</span> {formatPrice(product.price)}</p>
                {["Kits & Apparel", "Hoodies", "Footwear"].includes(product.category) && (
                  <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider mb-3 font-mono text-white/60">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 font-bold font-mono text-sm transition-all ${selectedSize === size ? "bg-amber-500 text-black" : "border border-white/20 hover:border-amber-500"}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-white/60">Qty</span>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-2">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-1 hover:bg-white/10"><Minus size={14} /></button>
                    <span className="w-6 text-center font-mono">{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)} className="p-1 hover:bg-white/10"><Plus size={14} /></button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CyberButton onClick={() => { onAddToCart({ ...product, quantity, size: selectedSize }); onClose(); }} className="flex-1">
                    <ShoppingBag size={16} />Add — KSH {formatPrice(product.price * quantity)}
                  </CyberButton>
                  <button className="w-14 h-14 border border-white/20 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all"><Heart size={20} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/* =======================
   CART DRAWER
======================= */
const CartDrawer = memo(({ isOpen, onClose, cart, setCart }: any) => {
  const updateQuantity = (index: number, delta: number) => {
    setCart(cart.map((item: CartItem, i: number) => i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const formatPrice = (price: number) => price.toLocaleString();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]" />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-zinc-900 border-l border-white/10 z-[60] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-black uppercase">Your Bag</h3>
                <p className="text-white/40 text-sm font-mono">{cart.length} items</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!cart.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={60} className="text-white/10 mb-4" />
                  <p className="text-white/40 font-mono mb-2">Your bag is empty</p>
                  <CyberButton onClick={onClose} className="mt-4">Continue Shopping</CyberButton>
                </div>
              ) : (
                cart.map((item: CartItem, idx: number) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 bg-black/30 p-3 border border-white/5">
                    <img src={item.image} className="w-20 h-20 object-cover" onError={(e: any) => { e.target.src = "https://via.placeholder.com/100?text=CR7"; }} />
                    <div className="flex-1">
                      <p className="font-bold uppercase text-sm line-clamp-1">{item.name}</p>
                      {item.size && <p className="text-white/40 text-xs font-mono">Size: {item.size}</p>}
                      <p className="text-amber-500 font-bold mt-1 font-mono text-sm">KSH {formatPrice(item.price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10">
                          <button onClick={() => updateQuantity(idx, -1)} className="p-1.5 hover:bg-white/10"><Minus size={12} /></button>
                          <span className="w-5 text-center font-mono text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(idx, 1)} className="p-1.5 hover:bg-white/10"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => setCart(cart.filter((_: any, i: number) => i !== idx))} className="text-red-500 text-xs font-mono hover:underline">Remove</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 font-mono">Subtotal</span>
                  <span className="text-2xl font-black font-mono">KSH {formatPrice(total)}</span>
                </div>
                <CyberButton className="w-full"><Fingerprint size={16} />Secure Checkout<ArrowRight size={16} /></CyberButton>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
});

/* =======================
   SEARCH MODAL
======================= */
const SearchModal = memo(({ isOpen, onClose, products, onAddToCart }: any) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() =>
    products.filter((p: Product) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.tagline.toLowerCase().includes(query.toLowerCase())
    ),
    [products, query]
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const formatPrice = (price: number) => price.toLocaleString();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-2xl flex flex-col items-center pt-[15vh] px-4" onClick={onClose}>
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="w-full max-w-2xl relative z-10" onClick={(e) => e.stopPropagation()}>
            <div className="relative mb-6">
              <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full bg-transparent border-b-2 border-white/20 py-4 text-2xl md:text-4xl font-black placeholder:text-white/20 focus:outline-none focus:border-amber-500 transition-colors font-mono" />
              <button onClick={onClose} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"><X size={28} /></button>
            </div>
            {query && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 max-h-[50vh] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-white/40 text-center py-8 font-mono">No products found</p>
                ) : (
                  filtered.slice(0, 6).map((p: Product) => (
                    <motion.div key={p.id} whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }} className="flex items-center gap-4 p-3 cursor-pointer border border-transparent hover:border-white/10 transition-all" onClick={() => { onAddToCart(p); onClose(); }}>
                      <img src={p.image} className="w-14 h-14 object-cover" onError={(e: any) => { e.target.src = "https://via.placeholder.com/100?text=CR7"; }} />
                      <div className="flex-1">
                        <p className="font-bold line-clamp-1">{p.name}</p>
                        <p className="text-white/40 text-sm font-mono">{p.category}</p>
                      </div>
                      <p className="font-black font-mono">KSH {formatPrice(p.price)}</p>
                      <ArrowRight size={18} className="text-amber-500" />
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/* =======================
   AUTH MODAL
======================= */
const AuthModal = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-8">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white"><X size={18} /></button>
            <h2 className="text-2xl font-black uppercase mb-6">{isLogin ? "Sign In" : "Create Account"}</h2>
            <form className="space-y-4">
              {!isLogin && <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-amber-500 font-mono" />}
              <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-amber-500 font-mono" />
              <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-amber-500 font-mono" />
              <CyberButton type="submit" className="w-full">{isLogin ? "Sign In" : "Create Account"}</CyberButton>
            </form>
            <p className="text-center text-white/40 text-sm mt-6 font-mono">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-amber-500 hover:underline">{isLogin ? "Sign Up" : "Sign In"}</button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

/* =======================
   BACK TO TOP
======================= */
const BackToTop = memo(() => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-amber-500 to-red-500 text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <ChevronUp size={22} />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

/* =======================
   APP (MAIN)
======================= */
export function App() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");

  const addToCart = useCallback((product: Product | CartItem) => {
    const cartItem: CartItem = { ...product, quantity: (product as CartItem).quantity || 1, size: (product as CartItem).size };
    setCart((prev) => [...prev, cartItem]);
    setCartOpen(true);
  }, []);

  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cursorContextValue = useMemo(() => ({ cursorText, setCursorText, cursorVariant, setCursorVariant }), [cursorText, cursorVariant]);

  return (
    <CursorContext.Provider value={cursorContextValue}>
      <div className="bg-black text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
        <AnimatePresence mode="wait">
          {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        {!loading && (
          <>
            <CustomCursor />
            <BackToTop />
            <Navbar cartCount={cartItemCount} toggleCart={() => setCartOpen(true)} onAuthClick={() => setAuthOpen(true)} onSearchClick={() => setSearchOpen(true)} />
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={PRODUCTS} onAddToCart={addToCart} />
            <QuickViewModal product={quickView} isOpen={!!quickView} onClose={() => setQuickView(null)} onAddToCart={addToCart} />
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} />
            <Hero />
            <MarqueeSection />
            <StatsSection />
            {CATEGORY_ORDER.map((cat) => {
              const items = PRODUCTS.filter((p) => p.category === cat.name);
              if (!items.length) return null;
              return <CategorySection key={cat.name} category={cat} products={items} onAdd={addToCart} onQuickView={setQuickView} />;
            })}
            <TestimonialsSection />
            <NewsletterSection />
            <Footer />
          </>
        )}

        <style>{`
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #000; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #f59e0b, #ef4444); border-radius: 3px; }
          ::selection { background: #f59e0b; color: #000; }
          .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
        `}</style>
      </div>
    </CursorContext.Provider>
  );
}

export default App;