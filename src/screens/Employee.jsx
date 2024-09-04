import { Link, useNavigate } from "react-router-dom";
import Header from './Header';
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Employee() {
    const navigate = useNavigate();
    const [Employees, setEmployees] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:3001/api/all_employees').then(respond => {
            console.log(respond);
            if (respond.data.success) {
                console.log(respond.data.results);
                setEmployees(respond.data.results)
            }
            else {
                toast.warn(respond.data.message);
            }
        },
            err => {

            }
        );
    },[])

    function edit(data) {
        navigate('/edit_employee', { state: { current: data } })
    }

    function delete_employee(data) {
        axios.delete('http://localhost:3001/api/delete_employee/' + data).then(respond => {

            if (respond.data.success) {
                toast(respond.data.message);
            }
            else {
                toast.warn(respond.data.message);
            }
        },
            err => {

            }
        );
    }
    return (<div >
        <ToastContainer />
        <Header />

        <button className="btn btn-primary" style={{ width: "100%", margin: '50px 0' }} onClick={() => navigate('/add_employee')}>Add Employee</button>
        <table id="customers">
            <thead>
                <th>Firstname</th>
                <th>lastame</th>
                <th>Salary</th>
                <th>Added By</th>
                <th>Action</th>
            </thead>
            <tbody>
                {Employees.map((emp, xid) => (
                    <tr key={xid}>
                        <td>{emp.firstname}</td>
                        <td>{emp.lastname}</td>
                        <td>{emp.salary}</td>
                        <td>{emp.email}</td>
                        <td>
                            <button className="btn btn-success" onClick={() => edit(emp)}>Edit</button>
                            <button className="btn btn-danger" onClick={() => delete_employee(emp.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>


    </div>)


}

export default Employee;