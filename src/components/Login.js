import React,{useEffect}from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/')
        }
    },[])
    const handleLogin = async () => {
        console.warn("email,password", email, password)
        let result = await fetch("http://localhost:7000/login", {
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        result = await result.json()
        console.warn(result);
        if (result.auth) {
            localStorage.setItem("user", JSON.stringify(result.user)); //1 
            localStorage.setItem("token", JSON.stringify(result.auth));
            navigate('/')
        } else {
            alert('please enter correct detail')
        }
    }
    return (
        <div className="login">
            <h1>Login</h1>
            <input className="inputbox" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
            <input className="inputbox" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
            <button className="appButton" type="button" onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login;