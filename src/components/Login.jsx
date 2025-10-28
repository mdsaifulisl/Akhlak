import { IoMdClose } from "react-icons/io";

import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";


const Login = ({ login, handleLogin }) => {
    const { Login } = useContext(AuthContext);

    const [error, setError] = useState("");
   
    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const success = Login(email, password);
        if (success) {
            setError("");
            handleLogin();
        } else {
            setError("Invalid email or password");
        }
    }
    
  return ( 
    <>
      <div>
        <div className={login ? "login active" : "login"}>
            <span className="close" onClick={handleLogin}><IoMdClose /></span>
        <div className="container">
          <div className="login__section">
            <div className="login_from">
              <h2>Login</h2>
              {error && <p className="text-danger">{error}</p>}
              <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
export default Login;
