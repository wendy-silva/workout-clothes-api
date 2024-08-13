<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../css/cart.css" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <title>Shopping Cart</title>
  </head>
  <body>
    <nav>
      <div>
        <button onclick="openMenu()">
          <span class="material-symbols-outlined">menu</span>
        </button>
      </div>
      <div id="brand">
        <p>EliteMode</p>
      </div>
      <div>
        <button>
          <a href="/clothes/products" class="home-button">
            <span class="material-symbols-outlined">home</span>
          </a>
        </button>
      </div>
    </nav>

    <div id="menu" class="menu">
      <button class="close-btn" onclick="closeMenu()">✖</button>
      <h2>Menu</h2>
      <ul>
        <li><a href="/auth/sign-out">Sign Out</a></li>
      </ul>
    </div>

    <script src="/js/script.js"></script>

    <main>
      <h1>Your Cart</h1>
    </main>
  </body>
</html>
