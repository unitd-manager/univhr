import React , {useContext }from 'react';
import { Row, Col, FormGroup, Label, Button, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

const SiteDetails = () => {
  // All state variables

  const [Sitedetails, setSiteDetails] = React.useState({ title: '' });

  // Navigation and Parameter Constants

  const navigate = useNavigate();

  //All Functions/Methods

  //Setting Data in Site Details
  const handleInputs = (e) => {
    setSiteDetails({ ...Sitedetails, [e.target.name]: e.target.value });
  };
  const { loggedInuser } = useContext(AppContext);
  //Api call for Insert Staff Data
  const insertSiteData = () => {
    Sitedetails.creation_date = creationdatetime;
    Sitedetails.created_by = loggedInuser.first_name;
      api
        .post('/Site/insertSite', Sitedetails)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Site Details inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/SiteEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Unable to Insert record.', 'error');
        });
   
  };

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer />
      <Row>
        <Col md="6" xs="12">
          <ComponentCard title="key Details">
            <FormGroup>
              <Row>
                <Col md="12">
                  <Label>
                    Name<span className="required"> *</span>
                  </Label>
                  <Input type="text" onChange={handleInputs} name="title" />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
            </FormGroup>
            <FormGroup>
              <Row>
                <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                  <Button
                    color="primary"
                    type="button"
                    className="btn mr-2 shadow-none"
                    onClick={() => {
                      insertSiteData();
                    }}
                  >
                    Save & Continue
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-dark shadow-none"
                    onClick={(e) => {
                      if (window.confirm('Are you sure you want to cancel? ')) {
                        navigate('/Site');
                      } else {
                        e.preventDefault();
                      }
                    }}
                  >
                    Go to List
                  </Button>
                </div>
              </Row>
            </FormGroup>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default SiteDetails;
