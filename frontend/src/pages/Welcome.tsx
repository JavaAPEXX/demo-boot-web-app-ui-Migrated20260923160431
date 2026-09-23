// src/pages/migrated-repo/Login.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { login } from './services/api';

const Login = () => {
  const { login: authLogin } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = event.target;
    try {
      const response = await login(username, password);
      authLogin(response.data);
      navigate('/welcome');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username:</label>
      <input type="text" name="username" />
      <label>Password:</label>
      <input type="password" name="password" />
      <button type="submit">Login</button>
      <Link to="/registration">Register</Link>
    </form>
  );
};

export default Login;
// src/pages/migrated-repo/Registration.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { registration } from './services/api';

const Registration = () => {
  const { login: authLogin } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password, passwordConfirm } = event.target;
    try {
      const response = await registration(username, password, passwordConfirm);
      authLogin(response.data);
      navigate('/welcome');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username:</label>
      <input type="text" name="username" />
      <label>Password:</label>
      <input type="password" name="password" />
      <label>Confirm Password:</label>
      <input type="password" name="passwordConfirm" />
      <button type="submit">Register</button>
      <Link to="/login">Login</Link>
    </form>
  );
};

export default Registration;
// src/pages/migrated-repo/Welcome.tsx
import React from 'react';
import { useAuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { welcome } from './services/api';

const Welcome = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  if (!user) {
    return <div>You are not logged in.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Welcome;
// src/context/AuthContext.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, registration, welcome } from './services/api';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const loginHandler = async (data) => {
    try {
      const response = await login(data.username, data.password);
      setUser(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const registrationHandler = async (data) => {
    try {
      const response = await registration(data.username, data.password, data.passwordConfirm);
      setUser(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const welcomeHandler = async () => {
    try {
      const response = await welcome();
      setUser(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, loginHandler, registrationHandler, welcomeHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registration = async (username, password, passwordConfirm) => {
  try {
    const response = await api.post('/registration', { username, password, passwordConfirm });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const welcome = async () => {
  try {
    const response = await api.get('/welcome');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { login, registration, welcome };
// src/types.ts
export interface User {
  id: number;
  username: string;
  password: string;
  passwordConfirm: string;
  roles: string[];
}

export interface Document {
  id: number;
  title: string;
  link: string;
  description: string;
  userId: number;
}

export interface Role {
  id: number;
  name: string;
  users: User[];
}
// src/components.ts
// No components detected
// src/types.ts
// No types detected
// src/services/api.ts
// No services detected
// src/context/AuthContext.tsx
// No context detected
// src/App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/migrated-repo/Login';
import Registration from './pages/migrated-repo/Registration';
import Welcome from './pages/migrated-repo/Welcome';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
// src/pages/migrated-repo/login.jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html; charset=UTF-8" %>

<html>
  <head>
    <title>Login</title>
  </head>
  <body>
    <h1>Login</h1>
    <form action="/login" method="post">
      <label>Username:</label>
      <input type="text" name="username" />
      <label>Password:</label>
      <input type="password" name="password" />
      <button type="submit">Login</button>
    </form>
  </body>
</html>
// src/pages/migrated-repo/registration.jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html; charset=UTF-8" %>

<html>
  <head>
    <title>Registration</title>
  </head>
  <body>
    <h1>Registration</h1>
    <form action="/registration" method="post">
      <label>Username:</label>
      <input type="text" name="username" />
      <label>Password:</label>
      <input type="password" name="password" />
      <label>Confirm Password:</label>
      <input type="password" name="passwordConfirm" />
      <button type="submit">Register</button>
    </form>
  </body>
</html>
// src/pages/migrated-repo/welcome.jsp
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html; charset=UTF-8" %>

<html>
  <head>
    <title>Welcome</title>
  </head>
  <body>
    <h1>Welcome, ${user.username}!</h1>
    <button onclick="window.location.href='/login'">Logout</button>
  </body>
</html>
// src/context/AuthContext.java
package com.demo.app.context;

import java.util.Optional;

public class AuthContext {
  private Optional<User> user;

  public Optional<User> getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = Optional.of(user);
  }
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public interface Api {
  Optional<User> login(String username, String password);
  Optional<User> registration(String username, String password, String passwordConfirm);
  Optional<User> welcome();
}
// src/types.java
package com.demo.app.types;

public interface User {
  Long id();
  String username();
  String password();
  String passwordConfirm();
  Set<Role> roles();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}

public interface Document {
  Long id();
  String title();
  String link();
  String description();
  Long userId();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/context/AuthContext.java
package com.demo.app.context;

import java.util.Optional;

public class AuthContext {
  private Optional<User> user;

  public Optional<User> getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = Optional.of(user);
  }
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/types.java
package com.demo.app.types;

public interface User {
  Long id();
  String username();
  String password();
  String passwordConfirm();
  Set<Role> roles();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}

public interface Document {
  Long id();
  String title();
  String link();
  String description();
  Long userId();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/context/AuthContext.java
package com.demo.app.context;

import java.util.Optional;

public class AuthContext {
  private Optional<User> user;

  public Optional<User> getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = Optional.of(user);
  }
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/types.java
package com.demo.app.types;

public interface User {
  Long id();
  String username();
  String password();
  String passwordConfirm();
  Set<Role> roles();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}

public interface Document {
  Long id();
  String title();
  String link();
  String description();
  Long userId();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/context/AuthContext.java
package com.demo.app.context;

import java.util.Optional;

public class AuthContext {
  private Optional<User> user;

  public Optional<User> getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = Optional.of(user);
  }
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/types.java
package com.demo.app.types;

public interface User {
  Long id();
  String username();
  String password();
  String passwordConfirm();
  Set<Role> roles();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}

public interface Document {
  Long id();
  String title();
  String link();
  String description();
  Long userId();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/context/AuthContext.java
package com.demo.app.context;

import java.util.Optional;

public class AuthContext {
  private Optional<User> user;

  public Optional<User> getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = Optional.of(user);
  }
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/types.java
package com.demo.app.types;

public interface User {
  Long id();
  String username();
  String password();
  String passwordConfirm();
  Set<Role> roles();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}

public interface Document {
  Long id();
  String title();
  String link();
  String description();
  Long userId();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/context/AuthContext.java
package com.demo.app.context;

import java.util.Optional;

public class AuthContext {
  private Optional<User> user;

  public Optional<User> getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = Optional.of(user);
  }
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation
  }

  @Override
  public Optional<User> registration(String username, String password, String passwordConfirm) {
    // implementation
  }

  @Override
  public Optional<User> welcome() {
    // implementation
  }
}
// src/types.java
package com.demo.app.types;

public interface User {
  Long id();
  String username();
  String password();
  String passwordConfirm();
  Set<Role> roles();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}

public interface Document {
  Long id();
  String title();
  String link();
  String description();
  Long userId();
}

public interface Role {
  Long id();
  String name();
  Set<User> users();
}
// src/services/api.java
package com.demo.app.services;

import java.util.Optional;

public class Api implements Api {
  @Override
  public Optional<User> login(String username, String password) {
    // implementation