export const fetchBooks = async (category='all', pageNo=1) => {
    const endpoint = `http://127.0.0.1:5000/books/categories/${category}?page=${pageNo}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  };

export const searchBooks = async (term='') => {
    const endpoint = `http://127.0.0.1:5000/books/search?search-term=${term}&page=1`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  };
  
export const getCategories = async () => {
    const response = await fetch('http://127.0.0.1:5000/categories');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = response.json();
    return data;
  };

export const fetchBookById = async (bookId) => {
    const endpoint = `http://127.0.0.1:5000/books/${bookId}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.results;
  };

export const login = async (email, password) => {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'Email': email, 'Password': password })
    });

    if(response.status != 200){
      return "";
    }

    var data = await response.json();
    return data.token;
  };

export const logout = async () => {
    const response = await fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      headers: {
        'x-auth-token': `${localStorage.getItem('x-auth-token')}`
      }
    });
    localStorage.removeItem('x-auth-token');
  };

export const register = async (firstName, lastName, email, password) => {
  const response = await fetch('http://127.0.0.1:5000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'FirstName': firstName,
      'LastName': lastName,
      'Email': email,
      'Password': password
    })
  });

  if(response.status != 200){
    return "";
  }

  var data = await response.json();
  return data.token;
};

export const placeOrder = async (orderDetails) => {
  const response = await fetch('http://127.0.0.1:5000/customer/order', {
    method: 'POST',
    headers: {
      'x-auth-token': `${localStorage.getItem('x-auth-token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderDetails)
  });

  if(response.status != 200){
    console.log(response);
    return "error";
  }
  var obj = await response.json();
  return obj.order_id;
};

export const fetchOrderById = async (orderId) => {
  const response = await fetch(`http://127.0.0.1:5000/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'x-auth-token': `${localStorage.getItem('x-auth-token')}`
    }
  });
  console.log(response);
  const data = await response.json();
  console.log("ORDER OBJECT");
  console.log(data);
  return data.results;
};

export const getOrders = async () => {
  const response = await fetch('http://127.0.0.1:5000/orders', {
    headers: {
      'x-auth-token': `${localStorage.getItem('x-auth-token')}`
    }
  });
  if (response.status != 200) {
    throw new Error('Failed to fetch orders');
  }
  
  var res = await response.json();
  return res.results;
};

export const fetchRecommendations = async (id='') => {
  const endpoint = `http://127.0.0.1:5000/recommendations?id=${id}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data.results;
};