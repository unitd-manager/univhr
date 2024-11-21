import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  TabPane,
  TabContent,
  Button,
} from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import api from '../../constants/api';
//import SiteButton from '../../components/SiteTable/SiteButton';
import creationdatetime from '../../constants/creationdatetime';
import ApiButton from '../../components/ApiButton';
import Tab from '../../components/project/Tab';

const SiteEdit = () => {
  //Const Variables
  const [Site, setSite] = useState();
  const [allCountries, setallCountries] = useState();
  const [activeTab, setActiveTab] = useState('1');
  const [RoomName, setRoomName] = useState('');
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  // const [pictureData, setDataForPicture] = useState({
  //   modelType: '',
  // });
  const [fileTypes, setFileTypes] = useState('');
  const [update, setUpdate] = useState(false);

  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  const backToList = () => {
    navigate('/Site');
  };

  const tabs =  [
    {id:'1',name:'Attachment'},
  
  ];

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  // const addContactToggle = () => {
  //   setAddContactModal(!addContactModal);
  // };
  //  Get Site by id
  const editSiteyId = () => {
    api
      .post('/Site/getSiteById', { site_id: id })
      .then((res) => {
        setSite(res.data.data[0]);
      })
      .catch(() => {
        message('Site Data Not Found', 'info');
      });
  };
  //Site Functions/Methods
  const handleInputs = (e) => {
    setSite({ ...Site, [e.target.name]: e.target.value });
  };
  //Logic for Site edit data in db
  const editSiteData = () => {
    if (Site.title !== '') {
      Site.modification_date = creationdatetime;
      api
        .post('/Site/editSite', Site)
        .then(() => {
          message('Record editted successfully', 'success');
          editSiteyId();
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  const getAllCountries = () => {
    api
      .get('/clients/getCountry')
      .then((res) => {
        setallCountries(res.data.data);
      })
      .catch(() => {
        message('Country Data Not Found', 'info');
      });
  };
  // delete Site
  const DeleteSite = () => {
    api
      .post('/Site/deleteSite', { site_id: id })
      .then(() => {
        message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
 
  useEffect(() => {
    editSiteyId();
    getAllCountries();
  }, [id]);

  return (
    <>
      <BreadCrumbs heading={Site && Site.title} />
   
<ApiButton
              editData={editSiteData}
              navigate={navigate}
              applyChanges={editSiteData}
              deleteData={DeleteSite}
              backToList={backToList}
              module="Site"
            ></ApiButton>
      {/* Main Details */}
      <Form>
        <FormGroup>
          <ComponentCard title="Site Details" creationModificationDate={Site}>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>
                    Title<span className="required"> *</span>
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={Site && Site.title}
                    name="title"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={Site && Site.phone}
                name="phone"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Website </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={Site && Site.website}
                name="website"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={Site && Site.email}
                name="email"
              />
            </FormGroup>
          </Col>
          
          <Col md="3">
            <FormGroup>
              <Label>Address 1 </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={Site && Site.address_flat}
                name="address_flat"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Address 2 </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={Site && Site.address_street}
                name="address_street"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Town</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={Site && Site.address_town}
                name="address_town"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>State</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={Site && Site.address_state}
                name="address_state"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              {' '}
              <Label>Country</Label>
              <Input
                type="select"
                name="address_country"
                onChange={handleInputs}
                value={Site && Site.address_country}
              >
                <option defaultValue="selected" value="">
                  Please Select
                </option>
                {allCountries &&
                  allCountries.map((country) => (
                    <option key={country.country_code} value={country.country_code}>
                      {country.name}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Postal Code</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={Site && Site.address_po_code}
                name="address_po_code"
              />
            </FormGroup>
          </Col>

              <Col md="3">
                <Label>Published</Label>
                <FormGroup>
                  <Input
                    type="radio"
                    name="published"
                    value="1"
                    onChange={handleInputs}
                    defaultChecked={Site && Site.published === 1 && true}
                  />
                  <Label>Yes</Label>

                  <Input
                    type="radio"
                    name="published"
                    value="0"
                    onChange={handleInputs}
                    defaultChecked={Site && Site.published === 0 && true}
                  />
                  <Label>No</Label>
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
      <ComponentCard title="More Details">
        <ToastContainer></ToastContainer>
        {/* Nav Tab */}
        <Tab toggle={toggle} tabs={tabs} />
        <TabContent className="p-4" activeTab={activeTab}>
          {/* Contact Linked */}
          <TabPane tabId="1">
          <ComponentCard title="Attachments">
            <Row>
              <Col xs="12" md="3" className="mb-3">
                <Button
                  color="primary"
                  onClick={() => {
                    setRoomName('Site');
                    setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                    dataForAttachment();
                    setAttachmentModal(true);
                  }}
                >
                  Add
                </Button>
              </Col>
            </Row>
          
            <AttachmentModalV2
              moduleId={id}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              roomName={RoomName}
              fileTypes={fileTypes}
              altTagData="SiteRelated Data"
              desc="SiteRelated Data"
              recordType="RelatedPicture"
              mediaType={attachmentData.modelType}
              update={update}
              setUpdate={setUpdate}
            />
            <ViewFileComponentV2
              moduleId={id}
              roomName="Site"
              recordType="RelatedPicture"
              update={update}
              setUpdate={setUpdate}
            />
          </ComponentCard>
          </TabPane>
        </TabContent>
      </ComponentCard>
          </>
  );
};
export default SiteEdit;
