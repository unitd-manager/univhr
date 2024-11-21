import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
import { Link } from 'react-router-dom';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const Finance = () => {
  //All State Variable
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(false);

  //getting data from Finance
  const getFinance = () => {
    api
      .get('/Finance/getFinances')
      .then((res) => {
        setFinance(res.data.data);
        $('#example').DataTable({
          pagingType: 'full_numbers',
          pageLength: 20,
          processing: true,
          dom: 'Bfrtip',
          // buttons: [
          //   {
          //     extend: 'print',
          //     text: 'Print',
          //     className: 'shadow-none btn btn-primary',
          //   },
          // ],
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getFinance();
  }, []);

  const columns = [
    {
      name: '#',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => (
        <Link to="/">
          <Icon.Edit3 />
        </Link>
      ),
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    {
      name: 'Order id',
      selector: 'order_id',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Company Name',
      selector: 'cust_company_name',
      sortable: true,
      grow: 0,
    },
    {
      name: 'Order Date',
      selector: 'order_date',
      sortable: true,
      width: 'auto',
      grow: 3,
    },
    {
      name: 'Project Type',
      selector: 'project_type',
      sortable: true,
      grow: 2,
      width: 'auto',
    },
    {
      name: 'Amount',
      selector: 'orderamount',
      sortable: true,
      width: 'auto',
    },

    {
      name: 'Status',
      selector: 'order_status',
      sortable: true,
      grow: 2,
      wrap: true,
    },
  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />

        <CommonTable loading={loading} title="Finance List">
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {finance &&
              finance.map((element, index) => {
                return (
                  <tr key={element.order_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/FinanceEdit/${element.order_id}?tab=1`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    <td>{element.order_id}</td>
                    <td>{element.cust_company_name}</td>
                    <td>{element.order_date}</td>
                    <td>{element.project_type}</td>
                    <td>{element.orderamount}</td>
                    <td>{element.order_status}</td>
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Finance;
