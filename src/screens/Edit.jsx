import { useState } from 'react';
import './style.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Edit() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [Currentuser, setCurrentUser] = useState({});
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Salary, setSalary] = useState('');

    useState(() => {
        console.log(state.current);
        setCurrentUser(state.current)

    }, [])

    function submit() {

        if (FirstName != '') {
            Currentuser.firstname = FirstName;
        }
        if (LastName != '') {
            Currentuser.lastname = LastName;
        }
        if (Salary != '') {
            Currentuser.salary = Salary;
        }


        axios.put('http://localhost:3001/api/update_employee/'+Currentuser.id, Currentuser).then(respond => {
            console.log(respond);
            if (respond.data.success) {
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

    return (
        <div>
            <ToastContainer />
            <Header />
            <h2>Register</h2>
            <div className="form-group">
                <label>First name</label>
                <input type="text" className="control-form" placeholder={Currentuser.firstname} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="form-group">
                <label>Last name</label>
                <input type="text" className="control-form" placeholder={Currentuser.lastname} onChange={(event) => setLastName(event.target.value)} />
            </div>
            <div className="form-group">
                <label>Salary</label>
                <input type="text" className="control-form" placeholder={Currentuser.salary} onChange={(event) => setSalary(event.target.value)} />
            </div>
            <div className="form-group">
                <button onClick={() => submit()}>Submit</button>
            </div>
        </div>
    );

}

export default Edit;