const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingBook = cart.find((item) => item._id === book._id);
  
    if (existingBook) {
      existingBook.quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
  };
  
  export { addToCart };