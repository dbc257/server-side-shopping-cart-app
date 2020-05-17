// Optional Group Assignment - Shopping Cart App

// In this assignment, you are going to build a shopping cart app for
//     mobile phones. You will allow the user to add items to their
//     shopping cart and checkout. Here are the features you need to
//     implement:
// 1) User should be able to register for the website
// 2) User should be able to login for the website
// 3) User should be able to look at all the products available on the website
// 4) User should be able to filter the products based on their manufacturer
// (Apple, Samsung, Google)
// 5) User should be able to see total number of cart items and the balance on
// the upper right hand corner of the website on every page.
// 6) User should be able to navigate to different pages from any page of the website
// 7) User should be able to review their order summary on a page
// * Start the app with an array of products (hardcoded). Each product should have
// the following properties:
// - title
// - category (Samsung, Google, Apple etc)
// - price

const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
var session = require("express-session");
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.urlencoded());

app.use(
  session({
    secret: "redrum",
    resave: false,
    saveUninitialized: true,
  })
);
// authentication function
function auth(req, res, next) {
  if (req.session) {
    if (req.session.userAuth) {
      next();
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
}

global.users = [];
global.products = [
  {
    title: "Samsung BN59-01289A Remote Control",
    category: "Samsung",
    price: "11.99",
  },
  {
    title: "Samsung Galaxy Buds+ Plus",
    category: "Samsung",
    price: "149.99",
  },
  {
    title: "Google 2 Pack Wi-Fi Router",
    category: "Google",
    price: "234.59",
  },
  {
    title:
      "Nest Indoor Security Camera Pack of 3 Bundle with 2 Pack WiFi Smart Plug",
    category: "Google",
    price: "379.00",
  },
  {
    title:
      "Apple Watch Series 5 (GPS, 44mm) - Silver Aluminum Case with White Sport Band",
    category: "Apple",
    price: "429.00",
  },
  {
    title: "Apple TV Remote",
    category: "Apple",
    price: "19.00",
  },
];

global.orderArray = [];

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/products", auth, (req, res) => {
  res.render("products", {
    productsList: products,
    balance: req.session.price.toFixed(2),
    itemCount: req.session.itemCount,
  });
});

app.get("/filter", auth, (req, res) => {
  res.render("filter", {
    balance: req.session.price.toFixed(2),
    itemCount: req.session.itemCount,
  });
});

app.post("/samsung", auth, (req, res) => {
  let filteredProduct = products.filter((s) => s.category == "Samsung");
  res.render("filter", {
    productFilter: filteredProduct,
    balance: req.session.price.toFixed(2),
    itemCount: req.session.itemCount,
  });
});

app.post("/google", auth, (req, res) => {
  let filteredProduct = products.filter((s) => s.category == "Google");
  res.render("filter", {
    productFilter: filteredProduct,
    balance: req.session.price.toFixed(2),
    itemCount: req.session.itemCount,
  });
});

app.post("/apple", auth, (req, res) => {
  let filteredProduct = products.filter((s) => s.category == "Apple");
  res.render("filter", {
    productFilter: filteredProduct,
    balance: req.session.price.toFixed(2),
    itemCount: req.session.itemCount,
  });
});

app.get("/ordersummary", auth, (req, res) => {
  let userProducts = orderArray.filter(
    (orderProduct) => orderProduct.username == req.session.username
  );
  res.render("ordersummary", {
    userProducts: orderArray,
    username: req.session.username,
    balance: req.session.price.toFixed(2),
    itemCount: req.session.itemCount,
  });
});

app.post("/ordersummary", (req, res) => {
  let title = req.body.title;
  let category = req.body.category;
  let price = req.body.price;
  let username = req.session.username;
  let userProduct = {
    title: title,
    category: category,
    price: price,
    username: username,
  };
  req.session.price += parseFloat(price);
  req.session.itemCount += 1;
  orderArray.push(userProduct);
  res.redirect("/ordersummary");
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let user = users.find(
    (u) => u.username == username && u.password == password
  );
  if (user) {
    if (req.session) {
      req.session.username = user.username;
      req.session.price = 0;
      req.session.itemCount = 0;
      req.session.userAuth = true;
      res.redirect("/products");
    } else {
      res.redirect("/login");
    }
  } else {
    res.render("login", { message: "Username and/or password is incorrect." });
  }
});

app.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let user = { username: username, password: password };
  let persistedUser = users.find((u) => u.username == user.username);
  if (persistedUser) {
    res.render("register", { message: "Username is already registered." });
  } else {
    users.push(user);
    res.redirect("/login");
  }
});

app.post("/remove", (req, res) => {
  req.session.itemCount -= 1;
  let price = req.body.price;
  req.session.price -= parseFloat(price);
  let title = req.body.title;
  let newOrderSummary = orderArray.filter((removeItem) => {
    return removeItem.title != title;
  });
  orderArray = newOrderSummary;
  res.redirect("/ordersummary");
});

app.post("/checkout", (req, res) => {
  req.session.itemCount = 0;
  req.session.price = 0;
  orderArray = [];
  res.redirect("/ordersummary");
});

app.post("/signout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Server is running...");
});
