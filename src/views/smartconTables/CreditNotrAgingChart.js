import React from 'react';
import Chart from 'react-apexcharts';
import ComponentCard from '../../components/ComponentCard';

const CreditNoteAgingChart = () => {
  const chartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: ['0-30 days', '31-60 days', '61-90 days', '>90 days'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Credit Note Aging Analysis',
      align: 'center'
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} Credit Notes`;
        }
      }
    }
  };

  const series = [10, 15, 8, 5]; // Replace this with your actual data

  return (
    <div>
      <ComponentCard title="Credit Note Aging Analysis">
        <Chart 
          options={chartOptions} 
          series={series} 
          type="donut" 
          height={350} 
        />
      </ComponentCard>
    </div>
  );
};

export default CreditNoteAgingChart;
