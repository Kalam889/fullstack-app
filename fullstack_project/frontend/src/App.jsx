import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [message, setMessage] = useState("");

  function fetchUsers() {
fetch("https://fullstack-app-a96x.onrender.com/users")

    .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setUsers(data);
      });
  }

  function registerUser() {
    fetch("https://fullstack-app-a96x.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setMessage(data.message);
        fetchUsers();
      });
  }

  function loginUser() {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.user) {
          setLoggedInUser(data.user);
          setMessage("Login successful");
        } else {
          setMessage(data.message);
        }
      });
  }

  useEffect(function () {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Full Stack App</h1>

      {/* REGISTER */}
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <br />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={registerUser}>Register</button>

      <hr />

      {/* LOGIN */}
      <h2>Login</h2>
      <input
        placeholder="Email"
        onChange={(e) => setLoginEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <br />
      <button onClick={loginUser}>Login</button>

      <p>{message}</p>

      {/* LOGGED IN VIEW */}
      {loggedInUser && (
        <h3>Logged in as {loggedInUser.name}</h3>
      )}

      <hr />

      <h2>Users from Database</h2>
      {users.map(function (user) {
        return (
          <p key={user.id}>
            {user.name} – {user.email}
          </p>
        );
      })}
    </div>
  );
}

export default App;
