import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

export default function PlanningMainDetails({ handleInputs, plannings, arabic, arb, genLabel }) {
  PlanningMainDetails.propTypes = {
    handleInputs: PropTypes.func,
    plannings: PropTypes.object,
    arabic:PropTypes.any,
    arb:PropTypes.any,
    genLabel:PropTypes.any,
  };
  return (
    <>
      <ComponentCard title="Equipment Issue Edit" creationModificationDate={plannings}>
        <Form>
          <FormGroup>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdEquipmentIssue.ProjectName')?.[genLabel]}
                  </Label>
                  <br />
                  <Input
                  type="text"
                  onChange={handleInputs}
                  value={plannings && plannings.proj_title}
                  name="proj_title" 
                  disabled
                />                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdEquipmentIssue.EquipmentCode')?.[genLabel]}
                  </Label>
                  <br />
                  <Input
                  type="text"
                  onChange={handleInputs}
                  value={plannings && plannings.equipment_request_code}
                  name="equipment_request_code"
                  disabled
                />  
               </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdEquipmentIssue.IssueDate')?.[genLabel]}
                  </Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={plannings && plannings.equipment_issue_date}
                    name="equipment_issue_date"
                  />
                </FormGroup>
              </Col>
           
            </Row>
            <Row>
         
              <Col md="3">
                <FormGroup>
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdEquipmentIssue.AuthorizedBy')?.[genLabel]}
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={
                      arb
                        ? (
                            plannings && plannings.authorized_by_arb ? plannings.authorized_by_arb :
                            (plannings && plannings.authorized_by_arb !== null ? '' : plannings && plannings.authorized_by)
                          )
                        : (plannings && plannings.authorized_by)
                    }
                    name={arb ? 'authorized_by_arb': 'authorized_by'}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdEquipmentIssue.Notes')?.[genLabel]}
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={
                      arb
                        ? (
                            plannings && plannings.notes_arb ? plannings.notes_arb :
                            (plannings && plannings.notes_arb !== null ? '' : plannings && plannings.notes)
                          )
                        : (plannings && plannings.notes)
                    }
                    name={arb ? 'notes_arb': 'notes'}
                  />
                </FormGroup>
              </Col>
             
             
            </Row>
           
            
            
        
          </FormGroup>
        </Form>
      </ComponentCard>
     
    </>
  );
}
