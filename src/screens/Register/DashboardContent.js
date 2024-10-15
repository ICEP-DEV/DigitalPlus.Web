import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    LineChart,
    Line,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import styles from './DashboardContent.module.css';

const DashboardContent = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    // Function to navigate to the Create New Announcement page
    const handleAddAnnouncement = () => {
        navigate('/create-new-announcement'); // Adjust the route as needed
    };

    // State to hold the data from the API
    const [dashboardData, setDashboardData] = React.useState({
        totalStudents: 0,
        activatedMentors: 0,
        deactivatedMentors: 0,
        totalMentors: 0,
    });

    // Fetch data from the API when the component mounts
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user.admin_Id) {
            const fetchDashboardData = async () => {
                try {
                    const response = await fetch(`https://localhost:7163/api/admin-dashboard/Dashboard/${user.admin_Id}`);
                    const data = await response.json();
                    setDashboardData(data); // Update state with API data
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                }
            };

            fetchDashboardData();
        } else {
            console.error('No admin_Id found in local storage.');
        }
    }, []);

    // Example pie data
    const pieData = [
        { name: 'Contact', value: 60 },
        { name: 'Online', value: 40 },
    ];

    const colors = ['#FF6347', '#FFA500']; // Red for Contact and Orange for Online

    // Example line chart data
    const lineData = [
        { date: '7/24', mentors: 50 },
        { date: '7/25', mentors: 45 },
        { date: '7/26', mentors: 40 },
        { date: '7/27', mentors: 35 },
        { date: '7/28', mentors: 30 },
        { date: '7/29', mentors: 35 },
        { date: '7/30', mentors: 40 },
        { date: '7/31', mentors: 45 },
        { date: '8/1', mentors: 50 },
    ];

    // Example bar chart data
    const barData = [
        { month: 'Jan', students: 70 },
        { month: 'Feb', students: 80 },
        { month: 'Mar', students: 75 },
        { month: 'Apr', students: 85 },
        { month: 'May', students: 65 },
        { month: 'Jun', students: 55 },
        { month: 'Jul', students: 80 },
        { month: 'Aug', students: 90 },
        { month: 'Sep', students: 75 },
        { month: 'Oct', students: 85 },
        { month: 'Nov', students: 95 },
        { month: 'Dec', students: 100 },
    ];

    return (
        <div className={styles.dashboardContainer}>
            <button className={styles.addAnnouncementButton} onClick={handleAddAnnouncement}>
                Add New Announcement
            </button>

            <div className={styles.header}>
                <div className={styles.statItem}>
                    <div className={styles.statItemIcon}>👥</div>
                    <div className={styles.stat}>
                        <h3 className={styles.statItemTitle}>Total Students</h3>
                        <p>{dashboardData.totalStudents}</p>
                    </div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statItemIcon}>👥</div>
                    <div className={styles.stat}>
                        <h3 className={styles.statItemTitle}>Activated Mentors</h3>
                        <p>{dashboardData.activatedMentors}</p>
                    </div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statItemIcon}>👥</div>
                    <div className={styles.stat}>
                        <h3 className={styles.statItemTitle}>Deactivated Mentors</h3>
                        <p>{dashboardData.deactivatedMentors}</p>
                    </div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statItemIcon}>👥</div>
                    <div className={styles.stat}>
                        <h3 className={styles.statItemTitle}>Total Mentors</h3>
                        <p>{dashboardData.totalMentors}</p>
                    </div>
                </div>
            </div>

            <div className={styles.chartGrid}>
                <div className={`${styles.chart} ${styles.pieChartContainer}`}>
                    <h4 className={styles.chartTitle}>Classes Allocation</h4>
                    <div className={styles.chartContent}>
                        <ResponsiveContainer width="50%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    outerRadius={80}
                                    innerRadius={60}
                                    labelLine={false}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className={styles.legend}>
                            {pieData.map((entry, index) => (
                                <div key={`legend-${index}`} className={styles.legendItem}>
                                    <div className={styles.colorBox} style={{ backgroundColor: colors[index] }}></div>
                                    <span>{entry.name}: {entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.chart}>
                    <h4 className={styles.chartTitle}>Weekly Activity</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="mentors" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.chart}>
                    <h4 className={styles.chartTitle}>Student Engagement</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="students" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
