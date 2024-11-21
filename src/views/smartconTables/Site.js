import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';
import Publish from '../../components/Publish';
// import SortOrder from '../../components/SortOrder';

const SiteDetails = () => {
  //Const Variables
  const [site, setsite] = useState(null);
  const [loading, setLoading] = useState(false);

  // Navigation and Parameter Constants
  const { id } = useParams();

  // get site
  const getsite = () => {
    api
      .get('/site/getsite')
      .then((res) => {
        setsite(res.data.data);
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
    getsite();
  }, [id]);
  //  stucture of site list view
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
      cell: () => <Icon.Edit2 />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },

    {
      name: 'Title',
      selector: 'title',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    
    {
      name: 'Published',
      selector: 'published',
      sortable: true,
      grow: 2,
      width: 'auto',
    },
   
  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />
        {/* site Add new button */}

        <CommonTable
          loading={loading}
          title="Site List"
          module='Site'
          Button={
            <Link to="/SiteDetails">
              <Button color="primary" className="shadow-none mr-2">
                Add New
              </Button>
            </Link>
          }
        >
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {site &&
              site.map((element, index) => {
                return (
                  <tr key={element.site_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/SiteEdit/${element.site_id}`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    <td>{element.title}</td>
                    <td>
                      <Publish
                        idColumn="site_id"
                        tablename="site"
                        idValue={element.site_id.toString()}
                        value={element.published}
                      ></Publish>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
        {/* setion table */}
      </div>
    </div>
  );
};

export default SiteDetails;
