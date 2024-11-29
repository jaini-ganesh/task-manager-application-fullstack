import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const csrfToken=Cookies.get('csrftoken');
    try {
      await axios.post(
        'http://localhost:8000/login/', 
        { username,password },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,  // Attach CSRF token
          },
          withCredentials: true,  // Include session cookies
        }
    );
      navigate('/home');  // Redirect to home on success
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form id="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
