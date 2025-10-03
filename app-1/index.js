const express = require("express");
const app = express();
const port = 3000;

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Sample users
let users = {
  "kuda": { pin: "1234", balance: 1000 },
  "sarah": { pin: "5678", balance: 2000 },
};

let currentUser = null;

// Login Page with added CSS
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Billit Banking System</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #4CAF50, #2196F3);
          color: white;
          text-align: center;
          padding: 50px;
        }
        .card {
          background: white;
          color: black;
          max-width: 400px;
          margin: 50px auto;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
        .btn {
          background: #007bff;
          color: white;
          padding: 12px 25px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 1em;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>🏦 Billit Banking System</h2>
        <form action="/login" method="POST">
          Username: <input type="text" name="username" /><br/>
          PIN: <input type="password" name="pin" /><br/>
          <button type="submit" class="btn">Login</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Handle login
app.post("/login", (req, res) => {
  const { username, pin } = req.body;
  if (users[username] && users[username].pin === pin) {
    currentUser = username;
    res.redirect("/menu");
  } else {
    res.send("❌ Invalid username or PIN. <a href='/'>Try again</a>");
  }
});

// Menu
app.get("/menu", (req, res) => {
  if (!currentUser) return res.redirect("/");

  res.send(`
    <h2>Welcome, ${currentUser}!</h2>
    <p>💰 Balance: ${users[currentUser].balance} $</p>
    <form action="/deposit" method="POST">
      <input type="number" name="amount" placeholder="Deposit Amount" />
      <button type="submit">Deposit</button>
    </form>
    <form action="/withdraw" method="POST">
      <input type="number" name="amount" placeholder="Withdraw Amount" />
      <button type="submit">Withdraw</button>
    </form>
    <a href="/logout">Logout</a>
  `);
});

// Deposit
app.post("/deposit", (req, res) => {
  let amount = parseFloat(req.body.amount);
  users[currentUser].balance += amount;
  res.redirect("/menu");
});

// Withdraw
app.post("/withdraw", (req, res) => {
  let amount = parseFloat(req.body.amount);
  if (amount > users[currentUser].balance) {
    res.send("❌ Insufficient funds. <a href='/menu'>Back</a>");
  } else {
    users[currentUser].balance -= amount;
    res.redirect("/menu");
  }
});

// Logout
app.get("/logout", (req, res) => {
  currentUser = null;
  res.redirect("/");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Billit Banking running at http://localhost:${port}`);
});