import React, { useState, useEffect } from 'react';
import { Form, Row, Col, FormGroup, Label, Input, Alert } from 'reactstrap';
import Chart from 'react-apexcharts';
import ComponentCard from '../ComponentCard';
import api from '../../constants/api'; // Assuming this is configured with axios or fetch

const SalesOrderStats = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [salesOrderStats, setSalesOrderStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to fetch all companies
  const fetchCompanies = async () => {
    try {
      const { data: { data } } = await api.get('/company/getCompany');
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setErrorMessage("Error fetching companies");
    }
  };

  // Function to fetch Sales Order statistics for the selected company
  const fetchSalesOrderStats = async (companyId) => {
    try {
      const { data } = await api.get('/projectsalesorder/getProjectOrderStats', {
        params: { company_id: companyId }
      });

      if (data.data.length === 0) {
        setSalesOrderStats(null);
        setErrorMessage('No orders found for the selected company');
        return;
      }

      const statusCounts = data.data.reduce((acc, order) => {
        acc[order.order_status] = (acc[order.order_status] || 0) + order.count;
        return acc;
      }, {});

      setSalesOrderStats(statusCounts);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching sales order stats:', error);
      setErrorMessage('Error fetching sales order stats');
    }
  };

  useEffect(() => {
    fetchCompanies(); // Fetch companies on component mount
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchSalesOrderStats(selectedCompany); // Fetch Sales Order statistics when company is selected
    }
  }, [selectedCompany]);

  const optionsBarChart = {
    chart: {
      id: 'bar-chart',
      fontFamily: "'Rubik', sans-serif",
      type: 'bar',
    },
    xaxis: {
      categories: ['New', 'Invoiced', 'Cancelled'],
      labels: {
        style: {
          colors: ['#36a2eb', '#ff6384', '#ffce56'],
          fontSize: '15px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Sales Orders',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#36a2eb', '#ff6384', '#ffce56'],
    tooltip: {
      theme: 'dark',
    },
    fill: {
      opacity: 1,
    },
  };

  const seriesBarChart = [
    {
      name: 'Sales Orders',
      data: [
        salesOrderStats?.New || 0,
        salesOrderStats?.Invoiced || 0,
        salesOrderStats?.Cancelled || 0,
      ],
    },
  ];

  return (
    <Row>
      <Col md="12">
        <ComponentCard title="Sales Order Statistics">
          <Form>
            <FormGroup>
              <Label for="companySelect">Select Company</Label>
              <Input
                type="select"
                name="company"
                id="companySelect"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Form>
          {errorMessage && (
            <Alert color="danger">
              {errorMessage}
            </Alert>
          )}
          {salesOrderStats && (
            <Chart options={optionsBarChart} series={seriesBarChart} type="bar" height="350" />
          )}
        </ComponentCard>
      </Col>
    </Row>
  );
};

export default SalesOrderStats;