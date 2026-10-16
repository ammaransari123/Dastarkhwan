// Fake REST API (localStorage). Har function ek REST endpoint ki tarah hai.
// Real backend lagana ho to inhe fetch("/api/...") se replace kar dein.
const KEY = "fo_db_v2"; // v2: naye restaurants load karne ke liye key badli
const wait = (data) => new Promise((r) => setTimeout(() => r(structuredClone(data)), 250));
const fail = (msg) => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), 250));
const uid = () => Math.random().toString(36).slice(2, 9);

const seed = {
  users: [{ id: "u1", name: "Admin", email: "admin@food.com", password: "admin123", role: "admin" }],
  restaurants: [
    { id: "r1", name: "Karachi Biryani House", cuisine: "Pakistani", rating: 4.6, emoji: "🍛" },
    { id: "r2", name: "Pizza Corner", cuisine: "Italian", rating: 4.3, emoji: "🍕" },
    { id: "r3", name: "Burger Lab", cuisine: "Fast Food", rating: 4.4, emoji: "🍔" },
    { id: "r4", name: "BBQ Tonight", cuisine: "BBQ", rating: 4.5, emoji: "🍖" },
    { id: "r5", name: "Dragon Wok", cuisine: "Chinese", rating: 4.2, emoji: "🥡" },
    { id: "r6", name: "Student Biryani", cuisine: "Pakistani", rating: 4.1, emoji: "🍚" },
    { id: "r7", name: "Sweet Tooth Bakers", cuisine: "Desserts", rating: 4.7, emoji: "🍰" },
    { id: "r8", name: "Sushi Zen", cuisine: "Japanese", rating: 4.0, emoji: "🍣" },
    { id: "r9", name: "Chai & Paratha Dhaba", cuisine: "Desi Breakfast", rating: 4.6, emoji: "🫓" },
    { id: "r10", name: "Taco Fiesta", cuisine: "Mexican", rating: 4.2, emoji: "🌮" },
    { id: "r11", name: "Fresh Juice Bar", cuisine: "Drinks", rating: 4.3, emoji: "🥤" },
  ],
  items: [
    { id: "i1", restaurantId: "r1", name: "Chicken Biryani", price: 450, category: "Main", desc: "Spicy basmati rice with chicken" },
    { id: "i2", restaurantId: "r1", name: "Seekh Kabab", price: 350, category: "Starter", desc: "Charcoal grilled, 4 pcs" },
    { id: "i3", restaurantId: "r1", name: "Raita", price: 60, category: "Side", desc: "Cool yogurt dip" },
    { id: "i4", restaurantId: "r2", name: "Fajita Pizza", price: 1200, category: "Main", desc: "Large, chicken fajita" },
    { id: "i5", restaurantId: "r2", name: "Garlic Bread", price: 300, category: "Side", desc: "Cheesy garlic sticks" },
    { id: "i6", restaurantId: "r3", name: "Zinger Burger", price: 550, category: "Main", desc: "Crispy chicken, mayo, lettuce" },
    { id: "i7", restaurantId: "r3", name: "Fries", price: 200, category: "Side", desc: "Salted crinkle fries" },
    { id: "i8", restaurantId: "r4", name: "Chicken Malai Boti", price: 700, category: "Main", desc: "Creamy grilled boti, 8 pcs" },
    { id: "i9", restaurantId: "r4", name: "Chapli Kabab", price: 400, category: "Starter", desc: "Peshawari style, 2 pcs" },
    { id: "i10", restaurantId: "r4", name: "Naan", price: 40, category: "Side", desc: "Fresh tandoori naan" },
    { id: "i11", restaurantId: "r5", name: "Chicken Chowmein", price: 650, category: "Main", desc: "Stir fried noodles" },
    { id: "i12", restaurantId: "r5", name: "Chicken Manchurian", price: 800, category: "Main", desc: "Sweet and spicy sauce" },
    { id: "i13", restaurantId: "r5", name: "Hot & Sour Soup", price: 350, category: "Starter", desc: "Classic bowl" },
    { id: "i14", restaurantId: "r6", name: "Beef Biryani", price: 380, category: "Main", desc: "Budget friendly plate" },
    { id: "i15", restaurantId: "r6", name: "Zarda", price: 150, category: "Dessert", desc: "Sweet rice" },
    { id: "i16", restaurantId: "r7", name: "Chocolate Cake Slice", price: 350, category: "Dessert", desc: "Rich dark chocolate" },
    { id: "i17", restaurantId: "r7", name: "Brownie", price: 250, category: "Dessert", desc: "Warm and gooey" },
    { id: "i18", restaurantId: "r7", name: "Cheesecake", price: 450, category: "Dessert", desc: "Blueberry topping" },
    { id: "i19", restaurantId: "r8", name: "Salmon Roll", price: 1500, category: "Main", desc: "8 pcs" },
    { id: "i20", restaurantId: "r8", name: "Chicken Katsu", price: 1100, category: "Main", desc: "Crispy cutlet with rice" },
    { id: "i21", restaurantId: "r8", name: "Miso Soup", price: 400, category: "Starter", desc: "Traditional" },
    { id: "i22", restaurantId: "r9", name: "Aloo Paratha", price: 180, category: "Main", desc: "With butter and achar" },
    { id: "i23", restaurantId: "r9", name: "Halwa Puri Set", price: 350, category: "Main", desc: "2 puri, halwa, chana" },
    { id: "i24", restaurantId: "r9", name: "Doodh Patti Chai", price: 80, category: "Drink", desc: "Dhaba style" },
    { id: "i25", restaurantId: "r10", name: "Chicken Tacos", price: 600, category: "Main", desc: "3 soft tacos" },
    { id: "i26", restaurantId: "r10", name: "Nachos Supreme", price: 550, category: "Starter", desc: "Cheese, salsa, jalapeno" },
    { id: "i27", restaurantId: "r10", name: "Burrito Bowl", price: 750, category: "Main", desc: "Rice, beans, chicken" },
    { id: "i28", restaurantId: "r11", name: "Mango Shake", price: 300, category: "Drink", desc: "Fresh mango, chilled" },
    { id: "i29", restaurantId: "r11", name: "Fresh Orange Juice", price: 250, category: "Drink", desc: "No sugar added" },
    { id: "i30", restaurantId: "r11", name: "Mint Margarita", price: 220, category: "Drink", desc: "Lemon, mint, soda" },
  ],
  orders: [],
};

const load = () => JSON.parse(localStorage.getItem(KEY) || "null") || (save(seed), structuredClone(seed));
const save = (db) => localStorage.setItem(KEY, JSON.stringify(db));

// ---- Auth ----
export async function register({ name, email, password }) {
  const db = load();
  if (db.users.some((u) => u.email === email)) return fail("Email already registered");
  const user = { id: uid(), name, email, password, role: "user" };
  db.users.push(user); save(db);
  const { password: _, ...safe } = user;
  return wait(safe);
}
export async function login({ email, password }) {
  const user = load().users.find((u) => u.email === email && u.password === password);
  if (!user) return fail("Invalid email or password");
  const { password: _, ...safe } = user;
  return wait(safe);
}

// ---- Restaurants & Menu ----
export const getRestaurants = (q = "") =>
  wait(load().restaurants.filter((r) => (r.name + r.cuisine).toLowerCase().includes(q.toLowerCase())));
export const getRestaurant = (id) => wait(load().restaurants.find((r) => r.id === id));
export const getItems = (restaurantId, q = "") =>
  wait(load().items.filter((i) => (!restaurantId || i.restaurantId === restaurantId) && (i.name + i.category).toLowerCase().includes(q.toLowerCase())));

// ---- Admin: menu CRUD ----
export async function saveItem(item) {
  const db = load();
  if (item.id) db.items = db.items.map((i) => (i.id === item.id ? { ...i, ...item } : i));
  else db.items.push({ ...item, id: uid() });
  save(db); return wait(true);
}
export async function deleteItem(id) {
  const db = load(); db.items = db.items.filter((i) => i.id !== id); save(db); return wait(true);
}

// ---- Orders ----
export async function placeOrder({ userId, userName, items, total, address, phone }) {
  const db = load();
  const order = { id: uid().toUpperCase(), userId, userName, items, total, address, phone, status: "Placed", createdAt: new Date().toISOString() };
  db.orders.unshift(order); save(db); return wait(order);
}
export const getOrder = (id) => wait(load().orders.find((o) => o.id === id));
export const getMyOrders = (userId) => wait(load().orders.filter((o) => o.userId === userId));
export const getAllOrders = () => wait(load().orders);
export async function updateOrderStatus(id, status) {
  const db = load(); db.orders = db.orders.map((o) => (o.id === id ? { ...o, status } : o)); save(db); return wait(true);
}
