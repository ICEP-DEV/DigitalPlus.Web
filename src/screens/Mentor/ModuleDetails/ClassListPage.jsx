import React, { useState, useEffect } from 'react';
import styles from './ClassListPage.module.css';
import { useParams, useNavigate } from 'react-router-dom';

const ClassListPage = () => {
    const [students, setStudents] = useState([]);
    const [modules, setModules] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { moduleId } = useParams();
    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchModulesAndMentees = async () => {
            try {
                const modulesResponse = await fetch(`https://localhost:7163/api/AssignMod/getmodulesBy_MentorId/${storedUser.mentorId}`);
                if (!modulesResponse.ok) {
                    throw new Error(`Modules API Error: ${modulesResponse.status}`);
                }
                const modulesData = await modulesResponse.json();
                setModules(modulesData);

                console.log("TEST");

                const menteesPromises = modulesData.map(async (module) => {
                    const { moduleCode } = module;
                    if (String(moduleCode) === String(moduleId)) {
                        const menteesResponse = await fetch(`https://localhost:7163/api/AssignMod/getmenteesBy_ModuleId/${modulesData[0].moduleId}`);
                        if (!menteesResponse.ok) {
                            throw new Error(`Mentees API Error for moduleId ${moduleId}: ${menteesResponse.status}`);
                        }
                        return await menteesResponse.json();
                    }
                    return [];
                });

                const menteesResults = await Promise.all(menteesPromises);
                setMentees(menteesResults.flat());
                
            } catch (err) {
                console.error("Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchModulesAndMentees();
    }, [moduleId, storedUser.mentorId]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMentees = mentees.filter((mentee) =>
        String(mentee.menteeId).includes(searchTerm) || 
        mentee.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
        `${mentee.firstName} ${mentee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>List of Students {moduleId ? `enrolled for ${moduleId}` : ''}</h1>
            <input 
                type="text"
                placeholder="Search by name, email, or ID"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STUDENT NUMBER</th>
                                <th>MENTEE NAME & SURNAME</th>
                                <th>EMAIL</th>
                                <th>CONTACT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMentees.map((mentee) => (
                                <tr key={mentee.menteeId}>
                                    <td>{mentee.menteeId}</td>
                                    <td>{`${mentee.firstName} ${mentee.lastName}`}</td>
                                    <td>{mentee.studentEmail}</td>
                                    <td>{mentee.contactNo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClassListPage;
