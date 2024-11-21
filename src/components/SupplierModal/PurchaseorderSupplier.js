import React, { useEffect, useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../constants/api';

const PurchaseorderSupplier = ({ receiptId, orderId, arb, arabic }) => {
  PurchaseorderSupplier.propTypes = {
    receiptId: PropTypes.any,
    orderId: PropTypes.any,
    arb: PropTypes.any,
    arabic: PropTypes.any,
  };

  const genLabel = arb ? 'arb_value' : 'value';

  const [invoiceReceipt, setInvoiceReceipt] = useState([]);
  const [selectedInvoiceAmount, setSelectedInvoiceAmount] = useState(0);
  const [createReceipt, setCreateReceipt] = useState({
    amount: 0,
    payment_status: 'Paid',
    date: moment(),
    supplier_receipt_code: '',
    mode_of_payment: 'cash',
    remarks: '',
  });
  const [selectedInvoice, setSelectedInvoice] = useState([]);

  const handleInputreceipt = (e) => {
    const { name, value } = e.target;
    setCreateReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const addAndDeductAmount = (checkboxVal, receiptObj) => {
    const remainingAmount = receiptObj.prev_inv_amount - receiptObj.prev_amount
    if (checkboxVal.target.checked) {
      setSelectedInvoiceAmount((prev) => prev + parseFloat(remainingAmount));
    } else {
      setSelectedInvoiceAmount((prev) => prev - parseFloat(remainingAmount));
    }
  };

  const removeObjectWithId = (arr, invoiceId) => {
    return arr.filter((obj) => obj.purchase_order_id !== invoiceId);
  };

  const getInvoices = (checkboxVal, invObj) => {
    if (checkboxVal.target.checked) {
      setSelectedInvoice((prev) => [...prev, invObj]);
    } else {
      setSelectedInvoice((prev) => removeObjectWithId(prev, invObj.purchase_order_id));
    }
  };

  const getinvoiceReceipt = () => {
    if (orderId) {
      api.post('/supplier/getMakePayment', { supplier_id: orderId }).then((res) => {
        const datafromapi = res.data.data;
        datafromapi.forEach((element) => {
          element.remainingAmount = element.prev_inv_amount - element.prev_amount;
        });
        const result = datafromapi.filter((el) => el.remainingAmount > 0);
        setInvoiceReceipt(result);
      });
    }
  };

  const updateReceipt = () => {
    const updatedReceiptData = {
      supplier_receipt_id: receiptId,
      amount: createReceipt.amount,
      mode_of_payment: createReceipt.mode_of_payment,
      date: createReceipt.date,
      remarks: createReceipt.remarks,
    };

    const updateReceiptPromise = api.post('/supplier/edit-SupplierReceipt', updatedReceiptData);

    if (selectedInvoice.length > 0) {
      const invoiceIds = selectedInvoice.map((invoice) => invoice.purchase_order_id);

      const updatedInvoiceStatusData = {
        po_code: invoiceIds,
        status: 'Paid',
      };

      const updateInvoiceStatusPromise = api.post('/supplier/edit-Supplier', updatedInvoiceStatusData);

      Promise.all([updateReceiptPromise, updateInvoiceStatusPromise])
        .then(([receiptRes, invoiceRes]) => {
          console.log('Receipt updated successfully', receiptRes);
          console.log('Invoice status updated successfully', invoiceRes);

          // Save each selected invoice's history
          let remainingAmount = parseFloat(createReceipt.amount);
          const historyPromises = selectedInvoice.map((invoice, index) => {
            const amountToSave = (index === selectedInvoice.length - 1)
              ? remainingAmount
              : Math.min(remainingAmount, parseFloat(invoice.remainingAmount));
            remainingAmount -= amountToSave;

            const historyData = {
              purchase_order_id: invoice.purchase_order_id,
              supplier_receipt_id: receiptId,
              amount: amountToSave,
              creation_date: moment().format('YYYY-MM-DD'),
            };

            return api.post('/supplier/insert-SupplierReceiptsHistory', historyData);
          });

          Promise.all(historyPromises)
            .then(() => {
              console.log('History saved successfully');
              setTimeout(() => {
                window.location.reload();
              }, 300);
            })
            .catch((error) => {
              console.error('Error saving history', error);
            });
        })
        .catch((error) => {
          console.error('Error updating receipt or invoice status', error);
        });
    } else {
      updateReceiptPromise
        .then((res) => {
          console.log('Receipt updated successfully', res);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating receipt', error);
        });
    }
  };

  const deleteCreatedReceipt = () => {
    if (receiptId) {
      api
        .post('/supplier/deleteReceipt', { data: { supplier_receipt_id: receiptId } })
        .then(() => {
          console.log('Created receipt record deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting created receipt record', error);
        });
    }
  };

  useEffect(() => {
    setCreateReceipt((prev) => ({ ...prev, amount: selectedInvoiceAmount.toString() }));
  }, [selectedInvoiceAmount]);

  useEffect(() => {
    getinvoiceReceipt();
  }, [orderId]);

  useEffect(() => {
    if (invoiceReceipt.length === 0) {
      deleteCreatedReceipt();
    }
  }, [invoiceReceipt]);

  return (
    <Row>
      <Col md="12">
        <Form>
          {invoiceReceipt.length > 0 ? (
            invoiceReceipt.map((element) => (
              <Row key={element.purchase_order_id}>
                <Col md="12">
                  <FormGroup check>
                    <Input
                      onChange={(e) => {
                        addAndDeductAmount(e, element);
                        getInvoices(e, element);
                      }}
                      name="po_code"
                      type="checkbox"
                    />
                    <span>
                      {element.po_code} ({element.remainingAmount}) Paid - {element.prev_amount}
                    </span>
                  </FormGroup>
                </Col>
              </Row>
            ))
          ) : (
            <p>No unpaid purchase available.</p>
          )}
          <br />
          <Row>
            <Col md="12">
              <FormGroup>
                <Label>{arabic.find((item) => item.key_text === 'mdMakeSupplier.Amount')?.[genLabel]}</Label>
                <Input
                  type="text"
                  onChange={handleInputreceipt}
                  value={createReceipt.amount}
                  name="amount"
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label>{arabic.find((item) => item.key_text === 'mdMakeSupplier.Date')?.[genLabel]}</Label>
                <Input
                  type="date"
                  onChange={handleInputreceipt}
                  value={moment(createReceipt.date).format('YYYY-MM-DD')}
                  name="date"
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label>
                  {arabic.find((item) => item.key_text === 'mdMakeSupplier.ModeOfPayment')?.[genLabel]}
                  <span className="required">*</span>
                </Label>
                <Input
                  type="select"
                  name="mode_of_payment"
                  value={createReceipt.mode_of_payment}
                  onChange={handleInputreceipt}
                >
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="giro">Giro</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label>{arabic.find((item) => item.key_text === 'mdMakeSupplier.Notes')?.[genLabel]}</Label>
                <Input
                  type="text"
                  onChange={handleInputreceipt}
                  value={createReceipt.remarks}
                  name="remarks"
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Button
              onClick={updateReceipt}
              type="button"
              className="btn btn-dark shadow-none"
            >
              {arb ? 'يحفظ' : 'Save'}
            </Button>
          </FormGroup>
        </Form>
      </Col>
    </Row>
  );
};

export default PurchaseorderSupplier;
