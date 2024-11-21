import React from 'react';
import Chart from 'react-apexcharts';

const DebitNoteStatusChart = () => {
  const chartOptions = {
    chart: {
      type: 'pie',
      height: 350
    },
    labels: ['Open', 'Pending', 'Resolved', 'Closed'],
    legend: {
      position: 'bottom'
    },
    title: {
      text: 'Debit Note Status Overview',
      align: 'center'
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val} Debit Notes`;
        }
      }
    }
  };

  const series = [20, 15, 30, 10]; // Replace this with your actual data

  return (
    <div>
      <Chart 
        options={chartOptions} 
        series={series} 
        type="pie" 
        height={350} 
      />
    </div>
  );
};

export default DebitNoteStatusChart;
