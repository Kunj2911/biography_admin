import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const collectData = async () => {
    try {
      const resp = await fetch("http://localhost:7000/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await resp.json();
      console.warn("register result:", result);

      if (result && result.auth && result.user) {
        // only save when valid
        localStorage.setItem("user", JSON.stringify(result.user));
        // If backend returns a token in future, save it; avoid saving boolean 'auth' as token
        if (result.token) localStorage.setItem("token", result.token);
        navigate("/");
      } else {
        const message = result && result.error ? result.error : "Signup failed";
        alert(message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network error during signup. Check server and CORS.");
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <input className="inputbox" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
      <input className="inputbox" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
      <input className="inputbox" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
      <button className="appButton" type="button" onClick={collectData}>Sign up</button>
    </div>
  );
};

export default Signup;
