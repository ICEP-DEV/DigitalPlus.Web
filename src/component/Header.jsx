import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


function Header() {
    const navigate = useNavigate();
    useEffect(() => {
        var user = JSON.parse(localStorage.getItem('user_info'))
        console.log(user);
        if (user === undefined || user === null) {
            navigate('/');
            return;
        }
    })
    const logout = () => {
        localStorage.removeItem('user_info');
        navigate('/')
    }
    return (<div id="header">

        <button className="nav_button" onClick={logout}>Logout</button>
    </div>)
}

export default Header;