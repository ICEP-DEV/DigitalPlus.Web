import { useState } from 'react';
import './style.css'
import { useNavigate } from 'react-router-dom';
 import Header from './Header';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const navigate = useNavigate();
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Salary, setSalary] = useState('');

    function submit() {
        if (FirstName === '') {
            alert('Enter first name');
            return;
        }
        if (LastName === '') {
            alert('Enter last name');
            return;
        }
        if (Salary === '') {
            alert('Enter Salary name');
            return;
        }

        var userInfo = JSON.parse(localStorage.getItem('user_info'))
        var data = {
            firstname: FirstName,
            lastname: LastName,
            salary: Salary,
            userId: userInfo.id
        }
        console.log(data);

        axios.post('http://localhost:3001/api/register_employee',data).then((respond)=>{
            if(respond.data.success){
                toast.warn(respond.data.message);
                setTimeout(
                    navigate('/emloyee')
                    , 5000);
            }
            else{
                toast.warn(respond.data.message);
            }
        })




    }
    return (
        <div>
             <ToastContainer />
            <Header />
            <h2>Register</h2>
            <div className="form-group">
                <label>First name</label>
                <input type="text" onChange={(event) => setFirstName(event.target.value)} className="control-form" />
            </div>
            <div className="form-group">
                <label>Last name</label>
                <input type="text" onChange={(event) => setLastName(event.target.value)} className="control-form" />
            </div>
            <div className="form-group">
                <label>Salary</label>
                <input type="text" onChange={(event) => setSalary(event.target.value)} className="control-form" />
            </div>
            <div className="form-group">
                <button onClick={() => submit()}>Submit</button>
            </div>
        </div>
    );
}

export default Register;