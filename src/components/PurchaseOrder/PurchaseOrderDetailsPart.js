/* eslint-disable */
import React from 'react';
import { Row, Col, Input, Form, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import ComponentCard from '../ComponentCard';

function PurchaseOrderDetailsPart({
  products,
  purchaseDetails,
  handleInputs,
  supplier,
  request,
  arabic,
  arb,
  isFieldDisabled,
}) {
  PurchaseOrderDetailsPart.propTypes = {
    purchaseDetails: PropTypes.object,
    handleInputs: PropTypes.func,
    supplier: PropTypes.array,
    request: PropTypes.array,
    arabic: PropTypes.any,
    arb: PropTypes.any,
    isFieldDisabled: PropTypes.any,
    products: PropTypes.array,
  };
console.log('products',products)
  let genLabel = '';

  if (arb === true) {
    genLabel = 'arb_value';
  } else {
    genLabel = 'value';
  }
  return (
    <div>
      <Form>
        <FormGroup>
          <ComponentCard
            title="PurchaseOrder Details" creationModificationDate={purchaseDetails} >
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdPurchaseOrder.PO Code')?.[genLabel]}
                  </Label>
                  <br></br>
                  <span>{purchaseDetails && purchaseDetails.po_code}</span>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdPurchaseOrder.Title')?.[genLabel]}
                  </Label>

                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={
                      arb
                        ? purchaseDetails && purchaseDetails.title_arb
                        : purchaseDetails && purchaseDetails.title
                    }
                    name={arb ? 'title_arb' : 'title'}
                  ></Input>
                </FormGroup>
              </Col>
              {/* <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdPurchaseOrder.Status')?.[genLabel]}
                  </Label>
                  <Input
                    type="select"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const statusField = arb ? 'status_arb' : 'status';
                      // Update the status field in your state with the selected value
                      handleInputs({ target: { name: statusField, value: selectedValue } });
                    }}
                    value={
                      arb
                        ? purchaseDetails && purchaseDetails.status_arb
                        : purchaseDetails && purchaseDetails.status
                    }
                    name="status"
                  >
                    <option value="">Please Select</option>
                    <option value="في تَقَدم">{arb ? 'في تَقَدم' : 'In Progress'}</option>
                    <option value="في تَقَدم">
                      {arb ? 'أرسلت إلى المورد' : 'Sent to supplier'}
                    </option>
                    <option value="في تَقَدم">
                      {arb ? 'تم قبول الطلب' : 'Order acknowledged'}
                    </option>
                    <option value="في تَقَدم">{arb ? 'تلقى جزئيا' : 'Partially received'}</option>
                    <option value="في تَقَدم">{arb ? 'مغلق' : 'Closed'}</option>
                    <option value="في تَقَدم">{arb ? 'في تَقَدم' : 'On hold'}</option>
                    <option value="في تَقَدم">{arb ? 'في الانتظار' : 'Cancelled'}</option>
                    <option value="في تَقَدم">{arb ? 'المحدد' : 'Selected'}</option>
                  </Input>
                </FormGroup>
              </Col> */}
              
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {
                      arabic.find((item) => item.key_text === 'mdPurchaseOrder.Supplier Name')?.[
                        genLabel
                      ]
                    }
                  </Label>

                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={purchaseDetails && purchaseDetails.supplier_id}
                    name="supplier_id"
                  >
                    <option defaultValue="selected">Please Select</option>
                    {supplier &&
                      supplier.map((e) => {
                        return (
                          <option key={e.supplier_id} value={e.supplier_id}>
                            {' '}
                            {arb ? e.company_name_arb : e.company_name}{' '}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>
              {products.length>0 && <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdPurchaseOrder.RQ Code')?.[genLabel]}
                  </Label>
                  <Input
                    type="select"
                    value={purchaseDetails && purchaseDetails.purchase_quote_id}
                    name="purchase_quote_id"
                    onChange={handleInputs}
                    disabled
                  >
                    <option defaultValue="selected">Please Select</option>
                    {request &&
                      request.map((e) => {
                        return (
                          <option key={e.supplier_id} value={e.purchase_quote_id}>
                            {e.rq_code}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>}
             {products.length<1 && <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdPurchaseOrder.RQ Code')?.[genLabel]}
                  </Label>
                  <Input
                    type="select"
                    value={purchaseDetails && purchaseDetails.purchase_quote_id}
                    name="purchase_quote_id"
                    onChange={handleInputs}
                   // disabled={!isFieldDisabled}
                  >
                    <option defaultValue="selected">Please Select</option>
                    {request &&
                      request.map((e) => {
                        return (
                          <option key={e.supplier_id} value={e.purchase_quote_id}>
                            {e.rq_code}
                          </option>
                        );
                      })}
                  </Input>
                </FormGroup>
              </Col>}
            </Row>
            <Row>
            <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdPurchaseOrder.PO Date')?.[genLabel]}
                  </Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={
                      purchaseDetails &&
                      moment(purchaseDetails.purchase_order_date).format('YYYY-MM-DD')
                    }
                    name="purchase_order_date"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {
                      arabic.find((item) => item.key_text === 'mdPurchaseOrder.Priority')?.[
                        genLabel
                      ]
                    }
                  </Label>

                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={purchaseDetails && purchaseDetails.prirority}
                  >
                    <option defaultValue="selected">Please Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {arabic.find((item) => item.key_text === 'mdPurchaseOrder.Status')?.[genLabel]}
                  </Label>
                  <Input
                    type="select"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const statusField = arb ? 'status_arb' : 'status';
                      // Update the status field in your state with the selected value
                      handleInputs({ target: { name: statusField, value: selectedValue } });
                    }}
                    value={
                      arb
                        ? purchaseDetails && purchaseDetails.status_arb
                        : purchaseDetails && purchaseDetails.status
                    }
                    name="status"
                  >
                    <option value="">Please Select</option>
                    <option value={arb ? 'في تَقَدم' : 'In Progress'}>{arb ? 'في تَقَدم' : 'In Progress'}</option>
                    <option value= {arb ? 'أرسلت إلى المورد' : 'Sent to supplier'}>
                      {arb ? 'أرسلت إلى المورد' : 'Sent to supplier'}
                    </option>
                    <option value= {arb ? 'تم قبول الطلب' : 'Order acknowledged'}>
                      {arb ? 'تم قبول الطلب' : 'Order acknowledged'}
                    </option>
                    <option value={arb ? 'تلقى جزئيا' : 'Partially received'}>{arb ? 'تلقى جزئيا' : 'Partially received'}</option>
                    <option value={arb ? 'مغلق' : 'Closed'}>{arb ? 'مغلق' : 'Closed'}</option>
                    <option value={arb ? 'في تَقَدم' : 'On hold'}>{arb ? 'في تَقَدم' : 'On hold'}</option>
                    <option value={arb ? 'في الانتظار' : 'Cancelled'}>{arb ? 'في الانتظار' : 'Cancelled'}</option>
                    <option value={arb ? 'المحدد' : 'Selected'}>{arb ? 'المحدد' : 'Selected'}</option>
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {
                      arabic.find((item) => item.key_text === 'mdPurchaseOrder.Follow Up Date')?.[
                        genLabel
                      ]
                    }
                  </Label>

                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={
                      purchaseDetails && moment(purchaseDetails.follow_up_date).format('YYYY-MM-DD')
                    }
                    name="follow_up_date"
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {
                      arabic.find(
                        (item) => item.key_text === 'mdPurchaseOrder.Notes To Supplier',
                      )?.[genLabel]
                    }
                  </Label>
                  <Input
                    type="textarea"
                    onChange={handleInputs}
                    value={
                      arb
                        ? purchaseDetails && purchaseDetails.notes_arb
                        : purchaseDetails && purchaseDetails.notes
                    }
                    name={arb ? 'notes_arb' : 'notes'}
                  ></Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {
                      arabic.find((item) => item.key_text === 'mdPurchaseOrder.Delivery Terms')?.[
                        genLabel
                      ]
                    }
                  </Label>
                  <Input
                    type="textarea"
                    onChange={handleInputs}
                    value={
                      arb
                        ? purchaseDetails && purchaseDetails.delivery_terms_arb
                        : purchaseDetails && purchaseDetails.delivery_terms
                    }
                    name={arb ? 'delivery_terms_arb' : 'delivery_terms'}
                  ></Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {
                      arabic.find((item) => item.key_text === 'mdPurchaseOrder.Payment Terms')?.[
                        genLabel
                      ]
                    }
                  </Label>
                  <Input
                    type="textarea"
                    onChange={handleInputs}
                    value={
                      arb
                        ? purchaseDetails && purchaseDetails.payment_terms_arb
                        : purchaseDetails && purchaseDetails.payment_terms
                    }
                    name={arb ? 'payment_terms_arb' : 'payment_terms'}
                  ></Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {
                      arabic.find((item) => item.key_text === 'mdPurchaseOrder.Payment Status')?.[
                        genLabel
                      ]
                    }
                  </Label>
                  <Input
                    type="select"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const statusField = arb ? 'payment_status_arb' : 'payment_status';
                      // Update the status field in your state with the selected value
                      handleInputs({ target: { name: statusField, value: selectedValue } });
                    }}
                    value={
                      arb
                        ? purchaseDetails && purchaseDetails.payment_status_arb
                        : purchaseDetails && purchaseDetails.payment_status
                    }
                    name={arb ? 'payment_status_arb' : 'payment_status'}
                  >
                    <option value="">Please Select</option>
                    <option value="حق">{arb ? 'حق' : 'Due'}</option>
                    <option value="مدفوع">{arb ? 'مدفوع' : 'Paid'}
                    </option>
                    <option value="في تَقَدم">{arb ? 'في تَقَدم' : 'Partially Paid'}
                    </option>
                    <option value="في تَقَدم">{arb ? 'في تَقَدم' : 'Cancelled'}</option>
                   
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label dir="rtl" style={{ textAlign: 'right' }}>
                    {
                      arabic.find(
                        (item) => item.key_text === 'mdPurchaseOrder.Supplier Invoice Code',
                      )?.[genLabel]
                    }
                  </Label>
                  <Input
                    type="text"
                    value={purchaseDetails && purchaseDetails.supplier_inv_code}
                    name="supplier_inv_code"
                    onChange={handleInputs}
                  ></Input>
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
    </div>
  );
}

export default PurchaseOrderDetailsPart;
