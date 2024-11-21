import React from 'react';
import Chart from 'react-apexcharts';
import ComponentCard from '../../components/ComponentCard';


const ExpensesOverTimeChart = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'], // Change this based on your data
      title: {
        text: 'Time Period'
      }
    },
    yaxis: {
      title: {
        text: 'Total Expenses (in currency)'
      }
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} Currency`;
        }
      }
    },
    title: {
      text: 'Expenses Over Time',
      align: 'center'
    }
  };

  const series = [
    {
      name: 'Total Expenses',
      data: [500, 1000, 750, 1100, 950, 800, 1200, 900] // Replace this with your actual data
    }
  ];

  return (
    <div>
      <ComponentCard title="Expenses Over Time">
      <Chart 
        options={chartOptions} 
        series={series} 
        type="line" 
        height={350} 
      />
      </ComponentCard>
    </div>
  );
};

export default ExpensesOverTimeChart;
