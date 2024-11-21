import React from 'react';
import Chart from 'react-apexcharts';
import ComponentCard from '../../components/ComponentCard';


const BalanceSheetChart = () => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Current Assets', 'Fixed Assets', 'Current Liabilities', 'Long-term Liabilities', 'Equity'],
    },
    yaxis: {
      title: {
        text: 'Amount (Currency)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} Currency`;
        }
      }
    }
  };

  const series = [
    {
      name: 'Amount',
      data: [40000, 35000, 12000, 22000, 15000]
    }
  ];

  return (
    <div>
      <ComponentCard title="Balance Sheet Composition">
      <Chart 
        options={chartOptions} 
        series={series} 
        type="bar" 
        height={350} 
      />
      </ComponentCard>
    </div>
  );
};

export default BalanceSheetChart;
