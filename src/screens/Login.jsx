import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../style/style.css'

import { useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');

    const login = () => {
        var data = { email: Email, password: Password }
        axios.post('http://localhost:3001/api/login', data).then(respond => {
            console.log(respond);
            if (respond.data.success) {
                console.log(respond.data.results[0]);
                var user = {
                    email: respond.data.results[0].email,
                    id: respond.data.results[0].id
                }
                localStorage.setItem('user_info', JSON.stringify(user));
                navigate('/emloyee')
            }
            else {
                toast.warn(respond.data.message);
            }
        },
            err => {
            }
        );

    }
    return (<div>
        <ToastContainer />
        <h2>Login</h2>
        <div className="form-group">
            <label>Email</label>
            <input type="email" onChange={(event) => setEmail(event.target.value)} className="control-form" />
        </div>
        <div className="form-group">
            <label>First name</label>
            <input type="password" onChange={(event) => setPassword(event.target.value)} className="control-form" />
        </div>
        <div className="form-group">
            <button onClick={login}>Login</button>
        </div>
    </div>);
}

export default Login;