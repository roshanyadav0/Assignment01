import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoughnutChart from './DoughnutChart';
import BarChart from './BarChart';
import '../css/Dashboard.css';

const API_BASE_URL = 'https://assignment01-mj8h.onrender.com';

const Dashboard = () => {
    const [customerTypes, setCustomerTypes] = useState([]);
    const [accountIndustries, setAccountIndustries] = useState([]);
    const [acvRanges, setAcvRanges] = useState([]);
    const [teams, setTeams] = useState([]);

    const fetchData = async () => {
        try {
            const [customerTypesRes, accountIndustriesRes, acvRangesRes, teamsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/customer-types`),
                axios.get(`${API_BASE_URL}/account-industries`),
                axios.get(`${API_BASE_URL}/acv-ranges`),
                axios.get(`${API_BASE_URL}/team`)
            ]);

            setCustomerTypes(customerTypesRes.data);
            setAccountIndustries(accountIndustriesRes.data);
            setAcvRanges(acvRangesRes.data);
            setTeams(teamsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const groupDataByQuarter = () => {
        const groupedData = customerTypes.reduce((acc, item) => {
            const { closed_fiscal_quarter, Cust_Type, count, acv } = item;
            if (!acc[closed_fiscal_quarter]) {
                acc[closed_fiscal_quarter] = {
                    "Existing Customer": { count: 0, acv: 0 },
                    "New Customer": { count: 0, acv: 0 }
                };
            }
            acc[closed_fiscal_quarter][Cust_Type].count += count;
            acc[closed_fiscal_quarter][Cust_Type].acv += acv;
            return acc;
        }, {});

        const totals = {
            "Existing Customer": { count: 0, acv: 0 },
            "New Customer": { count: 0, acv: 0 }
        };

        Object.values(groupedData).forEach(quarter => {
            totals["Existing Customer"].count += quarter["Existing Customer"].count;
            totals["Existing Customer"].acv += quarter["Existing Customer"].acv;
            totals["New Customer"].count += quarter["New Customer"].count;
            totals["New Customer"].acv += quarter["New Customer"].acv;
        });

        return { groupedData, totals };
    };

    const { groupedData, totals } = groupDataByQuarter();

    const calculatePercentage = (value, total) => total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';

    return (
        <div className='main'>
            <h4>Won ACV mix by Cust Type</h4>
            <div className="charts-container">
                <div className="chart-card">
                    <BarChart data={acvRanges} />
                </div>
                <div className="chart-card">
                    <DoughnutChart data={customerTypes} />
                </div>
            </div>
            <div className='inp-container'>
                <div className='inp'>
                    <div className='inp1'></div>
                    <p>Existing Customer</p>
                </div>
                <div className='inp'>
                    <div className='inp2'></div>
                    <p>New Customer</p>
                </div>
            </div>
            <div className='table-container'>
                <div className="table-header">
                    <div>Closed Fiscal Quarter</div>
                    {Object.keys(groupedData).map(quarter => (
                        <React.Fragment key={quarter}>
                            <div>{quarter}</div>
                        </React.Fragment>
                    ))}
                    <div>Total</div>
                </div>
                <div className="table-body">
                    {["Existing Customer", "New Customer"].map((custType) => (
                        <React.Fragment key={custType}>
                            <div className="table-row">
                                <div>{custType}</div>
                                {Object.keys(groupedData).map(quarter => (
                                    <div className="quarter-cell" key={quarter}>
                                        <div className="cell-group">
                                            <p>% of Opps: {groupedData[quarter][custType].count}</p>
                                            <p>ACV: {groupedData[quarter][custType].acv.toFixed(2)}</p>
                                            <p>% of Total: {calculatePercentage(groupedData[quarter][custType].acv, groupedData[quarter]["Existing Customer"].acv + groupedData[quarter]["New Customer"].acv)}%</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="total-cell">
                                    <div className="cell-group">
                                        <p>Total Opps: {totals[custType].count}</p>
                                        <p>Total ACV: {totals[custType].acv.toFixed(2)}</p>
                                        <p>% of Total: {calculatePercentage(totals[custType].acv, totals["Existing Customer"].acv + totals["New Customer"].acv)}%</p>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

