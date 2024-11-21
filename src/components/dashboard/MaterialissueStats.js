import React, { useState, useEffect } from 'react';
import { Form, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import Chart from 'react-apexcharts';
import ComponentCard from '../ComponentCard';
import api from '../../constants/api'; // Assuming this is configured with axios or fetch

const GoodsDeliveryChart = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [deliveryData, setDeliveryData] = useState(null);

  // Function to fetch all companies
  const fetchCompanies = async () => {
    try {
      const { data: { data } } = await api.get('/company/getCompany');
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Function to fetch goods delivery data for the selected company
  const fetchDeliveryData = async (companyId) => {
    try {
      const { data } = await api.get('/materialrequest/getMaterialStats', {
        params: { company_id: companyId }
      });

      console.log('Raw data:', data);

      // Format the data for the scatter chart
      const formattedData = data.data.map(item => ({
        x: item.title,  // Project title on x-axis
        y: item.material_request_count,  // Material request count on y-axis
        z: item.material_issue_count,  // Material issue count inside the bubble (point size)
      }));

      console.log('Formatted data:', formattedData);

      setDeliveryData(formattedData);
    } catch (error) {
      console.error('Error fetching delivery data:', error);
    }
  };

  useEffect(() => {
    fetchCompanies(); // Fetch companies on component mount
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchDeliveryData(selectedCompany); // Fetch delivery data when a company is selected
    }
  }, [selectedCompany]);

  const optionsScatterChart = {
    chart: {
      id: 'scatter-chart',
      fontFamily: "'Rubik', sans-serif",
      type: 'scatter',
      height: '400',
    },
    xaxis: {
      title: {
        text: 'Project Name',
        style: {
          fontSize: '14px',
        },
      },
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: 'Material Request Count',
        style: {
          fontSize: '14px',
        },
      },
    },
    markers: {
      size: deliveryData ? deliveryData.map(item => item.z * 30) : [], // Increased size by multiplying by 3
      strokeWidth: 2, // Adjust stroke width for better visibility
    },
    fill: {
      opacity: 0.8,
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '100px',
      fontFamily: "'Montserrat', sans-serif",
      labels: {
        colors: '#8898aa',
      },
    },
    tooltip: {
      theme: 'dark',
      x: {
        formatter: (val) => `Project: ${val}`,
      },
      y: {
        formatter: (val) => `Material Request Count: ${val}`,
      },
      z: {
        formatter: (val) => `Material Issue Count: ${val}`,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const issueCount = opts.w.globals.seriesZ[opts.seriesIndex][opts.dataPointIndex];
        console.log(`Data label value for seriesIndex ${opts.seriesIndex}, dataPointIndex ${opts.dataPointIndex}: ${issueCount}`);
        return issueCount;  // Show material issue count inside the bubble
      },
      style: {
        colors: ['#000000'], 
        fontSize: '12px',    // Slightly larger font size for better readability
        fontWeight: 'bold',
      },
      background: {
        enabled: true,
        foreColor: '#FFFFFF',
        borderRadius: 9, // Increased border radius for larger background size
        padding: 4,
        opacity: 0, // Adjusted opacity for better contrast
      },
    },
  };

  const seriesScatterChart = [
    {
      data: deliveryData || [],
    },
  ];

  return (
    <Row>
      <Col md="12">
        <ComponentCard title="Material Issue Statistics">
          <Form  style={{paddingBottom:"30px"}}>
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
          {deliveryData && (
            <Chart options={optionsScatterChart} series={seriesScatterChart} type="scatter" height="350"  />
          )}
        </ComponentCard>
      </Col>
    </Row>
  );
};

export default GoodsDeliveryChart;
