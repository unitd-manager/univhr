import React from 'react';
import { Col, Row } from 'reactstrap';
import TaskSummary from '../../components/dashboard/TaskSummary';
import ProjectSummaryChart from '../../components/dashboard/ProjectSummaryChart';
import LabourSummary from '../../components/dashboard/LabourSummary';
import MaterialissueStats from '../../components/dashboard/MaterialissueStats';
import ProjectChart from '../../components/DashboardProj/ProjectChart';
import Subcon from '../../components/DashboardProj/SubCon';
import ProjectOrderStats from '../../components/DashboardProj/ProjectOrderStats';
import ProjectQuotationChart  from '../../components/dashboard/ProjectQuotationChart'
import ProjectEnquiryChart from '../../components/dashboard/ProjectEnquiryChart';
import EquipmentissueStats from '../../components/dashboard/EquipmentissueStats';

const Test = () => {

  return (
    <div >
      <Row>
        <Col lg='12'>
        <ProjectEnquiryChart/>
        <ProjectQuotationChart/>
        <ProjectChart/>
        <Subcon/>
        <ProjectOrderStats/>
        <MaterialissueStats/>
        <EquipmentissueStats/>
        <ProjectSummaryChart/>
        <TaskSummary/>
        <LabourSummary/>  
        </Col>
      </Row>
  
    </div>
  );
};

export default Test;
