import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoughnutChart from './DoughnutChart';
import BarChart from './BarChart';

const Dashboard = () => {
    const [customerTypes, setCustomerTypes] = useState([]);
    const [accountIndustries, setAccountIndustries] = useState([]);
    const [acvRanges, setAcvRanges] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customerTypesRes, accountIndustriesRes, acvRangesRes, teamsRes] = await Promise.all([
                    axios.get('http://localhost:3000/customer-types'),
                    axios.get('http://localhost:3000/account-industries'),
                    axios.get('http://localhost:3000/acv-ranges'),
                    axios.get('http://localhost:3000/team')
                ]);

                setCustomerTypes(customerTypesRes.data);
                setAccountIndustries(accountIndustriesRes.data);
                setAcvRanges(acvRangesRes.data);
                setTeams(teamsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const printData = () => {
        console.log("Customer Type data -->", customerTypes);
        console.log("Account industries data -->", accountIndustries);
        console.log("ACV Ranges data -->", acvRanges);
        console.log("Teams data -->", teams);
    };

    return (
        <div>
            <h1>Customer Analytics Dashboard</h1>
            <div className="charts-container">
                <div className="chart-card">
                    <h2>Total Customers</h2>
                    <DoughnutChart data={customerTypes} />
                </div>
                <div className="chart-card">
                    <h2>Customer Distribution by Quarter</h2>
                    <BarChart data={acvRanges} />
                </div>

                <button onClick={printData}>Print Data</button>
            </div>
        </div>
    );
};

export default Dashboard;
