import React, { useState, useEffect ,useContext} from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import message from '../../components/Message';
import 'bootstrap/dist/css/bootstrap.min.css';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import AppContext from '../../context/AppContext';
import creationdatetime from '../../constants/creationdatetime';

const EquipmentRequestDetails = () => {
  //Navigation and Parameter Constants
  const navigate = useNavigate();
  const { loggedInuser } = useContext(AppContext);
  //Logic for adding Planning in db
  const [planningForms, setPlanningForms] = useState({
    request_date: '',
    project_id: '',
  });
  const [project, setProject] = useState();
  const { id } = useParams();

  const editJobById = () => {
    api
      .get('/labourrequest/getProjecttitle')
      .then((res) => {
        setProject(res.data.data);
      })
      .catch(() => {});
  };
  //setting data in PlanningForms
  const handlePlanningForms = (e) => {
    setPlanningForms({ ...planningForms, [e.target.name]: e.target.value });
  };

  //Api for insertPlanning
  const insertPlanning = (code) => {
    if (planningForms.project_id !== '') {
      planningForms.creation_date = creationdatetime;
      planningForms.created_by = loggedInuser.first_name;
      planningForms.equipment_request_code = code;

      api
        .post('/equipmentrequest/insertEquipmentRequest', planningForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Request inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/EquipmentRequestEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  const generateCode = () => {
    api
      .post('/tender/getCodeValue', { type: 'equipmentrequest' })
      .then((res) => {
        insertPlanning(res.data.data);
      })
      .catch(() => {
        insertPlanning('');
      });
  };
  useEffect(() => {
    editJobById();
  }, [id]);
  return (
    <div>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Row>
        <Col md="6">
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="10">
                  <Label>
                    Title <span style={{ color: 'red' }}>*</span>{' '}
                  </Label>
                  <Input
                    type="select"
                    name="project_id"
                    onChange={(e) => {
                      handlePlanningForms(e);
                    }}
                  >
                    <option value="" selected>
                      Please Select
                    </option>
                    {project &&
                      project.map((ele) => {
                        return (
                          <option key={ele.project_id} value={ele.project_id}>
                            {ele.project_title}
                          </option>
                        );
                      })}
                  </Input>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        generateCode();
                      }}
                      type="button"
                      className="btn mr-2 shadow-none"
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate(-1);
                      }}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
                      Go to List
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};
export default EquipmentRequestDetails;