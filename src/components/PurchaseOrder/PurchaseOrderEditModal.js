import React, { useContext, useState, useEffect } from 'react';
import {
  FormGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Input,
} from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';
import creationdatetime from '../../constants/creationdatetime';
import AppContext from '../../context/AppContext';

//purchaseordereditmodal From VehicleEdit
const ProjectPartialInvoiceEdit = ({ purchaseordereditmodal, setPurchaseOrderEditModal, PurchaseOrderId, products, product }) => {
    ProjectPartialInvoiceEdit.propTypes = {
    purchaseordereditmodal: PropTypes.bool,
    setPurchaseOrderEditModal: PropTypes.func,
    PurchaseOrderId: PropTypes.any,
    products: PropTypes.array,
    product: PropTypes.object,

  };
  // let genLabel = '';

  // if (arb === true) {
  //   genLabel = 'arb_value';
  // } else {
  //   genLabel = 'value';
  // }

  // All State Variable

  const [purchaseordereditdetails, setPurchaseOrderEditDetails] = useState();
  // get staff details
  const { loggedInuser } = useContext(AppContext);

  const [totalAmount, setTotalAmount] = useState(0);

  const handleCalc = (Qty, UnitPrice) => {
    if (!Qty) Qty = 0;
    if (!UnitPrice) UnitPrice = 0;

    const calculatedTotalAmount = parseFloat(Qty) * parseFloat(UnitPrice);
    setTotalAmount(calculatedTotalAmount);
    // Do something with calculatedTotalAmount if needed.
  };
  function updateState(index, property, e) {
    const copyDeliverOrderProducts = [...purchaseordereditdetails];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };

    const quantity = parseFloat(updatedObject.project_invoice_qty) || 0;
    const unitPrice = parseFloat(updatedObject.unit_price) || 0;
    updatedObject.total_cost = quantity * unitPrice;
    updatedObject.modification_date = creationdatetime;
    updatedObject.modified_by = loggedInuser.first_name;
    updatedObject.project_invoice_qty = e.target.value; // Set project_invoice_qty to the entered value
    

    copyDeliverOrderProducts[index] = updatedObject;
    setPurchaseOrderEditDetails(copyDeliverOrderProducts);
  }
  const getSelectedLanguageFromLocalStorage = () => {
    return localStorage.getItem('selectedLanguage') || '';
  };

  const selectedLanguage = getSelectedLanguageFromLocalStorage();
  const [arabic, setArabic] = useState([]);

  const arb = selectedLanguage === 'Arabic';

  // const eng = selectedLanguage === 'English';

  const getArabicCompanyName = () => {
    api
    .get('/purchaseorder/getTranslationForPurchaseOrder')
    .then((res) => {
      setArabic(res.data.data);
    })
    .catch(() => {
      // Handle error if needed
    });   
};

  console.log('arabic', arabic);
  useEffect(() => {
    getArabicCompanyName();
  }, []);
  let genLabel = '';

  if (arb === true) {
    genLabel = 'arb_value';
  } else {
    genLabel = 'value';
  }

  //Api call for getting Vehicle Insurance Data By ID
  const OrderLineItemsById = () => {
    api
      .post('/purchaseorder/TabPurchaseOrderLineItemById', { purchase_order_id: PurchaseOrderId })
      .then((res) => {
        setPurchaseOrderEditDetails(res.data.data);
      })
      .catch(() => {
        message('Order Data Not Found', 'info');
      });
  };

  //Api call for Insert Vehicle Insurance Data
  const editSalesInvoice = () => {

    purchaseordereditdetails.forEach((item) => {
      console.log('API Request Payload:', item);
      api
        .post('/purchaseorder/editTabPurchaseOrderLineItem', item)
        .then(() => {
          message('Line Item Edited Successfully', 'sucess');
          window.location.reload();
        })
        .catch(() => {
          message('Cannot Edit Line Items', 'error');
        });
    })
  };

  // useEffect for Vehicle Insurance
  useEffect(() => {
    OrderLineItemsById();
  }, [PurchaseOrderId]);

  const purchaseTableColumn = [
    {
      name: '#',
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Product Code')?.[genLabel],
  
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Product Title')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Cost Price')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Selling Price')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.GST')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Stock')?.[genLabel],
  
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Qty')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Damaged Qty')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Added to Stock')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Qty Balance')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Status')?.[genLabel],
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Total Amount')?.[genLabel],
  
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Actual Total Amount')?.[genLabel],
    },
  ];

  return (
    <>
      <Modal size="xl" isOpen={purchaseordereditmodal}>
        <ModalHeader>
          {arb ? 'عناصر الفاتورة' : 'Invoice Items'}
          <Button
            color="secondary"
            onClick={() => {
              setPurchaseOrderEditModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
        <Table bordered className="lineitem">
          <thead title="Purchase Order Linked ">
            <tr>
              {purchaseTableColumn.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((element, index) => {
                return (
                  <tr key={element.po_product_id}>
                  
                    <td>{index + 1}</td>
                    <td>
                    <Input
                            type="text"
                            
                            defaultValue={
                              arb
                                ? element && element.item_code_arb
                                  ? element.item_code_arb
                                  : element && element.item_code_arb !== null
                                    ? ''
                                    : element && element.item_code
                                : element && element.item_code
                            }
                            name={arb ? 'item_code_arb' : 'item_code'}
                          />
                    </td>
                    <td>{arb ? element.title_arb : element.title}
                    <Input
                            type="text"
                            
                            defaultValue={
                              arb
                                ? element && element.item_code_arb
                                  ? element.item_code_arb
                                  : element && element.item_code_arb !== null
                                    ? ''
                                    : element && element.item_code
                                : element && element.item_code
                            }
                            name={arb ? 'item_code_arb' : 'item_code'}
                          /></td>
                    <td>{arb ? element.cost_price_arb : element.cost_price}
                    <Input
                            type="text"
                            
                            defaultValue={
                              arb
                                ? element && element.item_code_arb
                                  ? element.item_code_arb
                                  : element && element.item_code_arb !== null
                                    ? ''
                                    : element && element.item_code
                                : element && element.item_code
                            }
                            name={arb ? 'item_code_arb' : 'item_code'}
                          />
                    </td>
                    <td>{arb ? element.selling_price_arb : element.selling_price}</td>
                    <td>{arb ? element.gst_arb : element.gst}</td>
                    <td>{element.qty_in_stock}</td>
                    <td>{arb ? element.quantity_arb : element.quantity}
                    <Input
                        type="text"
                        name="qty"
                        onChange={(e) => {
                          updateState(index, 'quantity', e);
                        }}
                        value={product && product.quantity}
                      /></td>
                    <td>{arb ? element.damage_qty_arb : element.damage_qty}
                    <Input
                            type="text"
                            onChange={(e) => {
                              updateState(index, 'total_cost', e);
                              handleCalc(element.project_invoice_qty, element.unit_price);
                            }}
                            defaultValue={
                              arb
                                ? totalAmount ||element && element.total_cost_arb
                                  ? totalAmount ||element.total_cost_arb
                                  : totalAmount ||element && element.total_cost_arb !== null
                                    ? ''
                                    : totalAmount ||element && element.total_cost
                                :totalAmount || element && element.total_cost
                            }
                            name={arb ? 'total_cost_arb' : 'total_cost'}
                            disabled

                          />
                    </td>
                    <td>{arb ? element.qty_delivered_arb : element.qty_delivered}
                    <Input
                        type="text"
                        name="qty"
                        onChange={(e) => {
                          updateState(index, 'quantity', e);
                        }}
                        value={product && product.quantity}
                      />
                      </td>
                    <td>{arb ? element.qty_balance_arb : element.qty_balance}
                    <Input
                        type="text"
                        name="qty"
                        onChange={(e) => {
                          updateState(index, 'quantity', e);
                        }}
                        value={product && product.quantity}
                      />
                    </td>
                    <td>{arb ? element.status_arb : element.status}
                    <Input
                        type="text"
                        name="qty"
                        onChange={(e) => {
                          updateState(index, 'quantity', e);
                        }}
                        value={product && product.quantity}
                      />
                    </td>
                    <td>{arb ? element.po_value_arb : element.po_value}
                    <Input
                            type="text"
                            onChange={(e) => {
                              updateState(index, 'total_cost', e);
                              handleCalc(element.project_invoice_qty, element.unit_price);
                            }}
                            defaultValue={
                              arb
                                ? totalAmount ||element && element.total_cost_arb
                                  ? totalAmount ||element.total_cost_arb
                                  : totalAmount ||element && element.total_cost_arb !== null
                                    ? ''
                                    : totalAmount ||element && element.total_cost
                                :totalAmount || element && element.total_cost
                            }
                            name={arb ? 'total_cost_arb' : 'total_cost'}
                            disabled

                          />

                    </td>
                    <td>{arb ? element.actual_value_arb : element.actual_value}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </FormGroup>
      </ModalBody>

        {/* <ModalBody>
          <FormGroup>
            <Table bordered className="lineitem">
              <thead>
                <tr>
                  <th scope="col"> {arb ? 'عنوان' : 'Title'}</th>
                  <th scope="col">{arb ? 'وحدة' : 'Unit'}</th>
                  <th scope="col">{arb ? 'سعر الوحدة' : 'Unit Price'}</th>
                  <th scope="col">{arb ? 'الكمية المطلوبة' : 'ordered Quantity'}</th>
                  <th scope="col">{arb ? 'كمية الفاتورة' : 'invoice Quantity'}</th>
                  <th scope="col">{arb ? 'المبلغ الإجمالي' : 'Total Amount'}</th>
                  <th scope="col"> {arb ? 'تم التحديث بواسطة' : 'Updated By'}</th>


                </tr>
              </thead>
              <tbody>
                {purchaseordereditdetails &&
                  purchaseordereditdetails.map((invoiceItem, index) => {
                    return (
                      <tr key={invoiceItem.id}>
                        <td>
                          <Label dir="rtl" style={{ textAlign: 'right' }}>
                            {arabic.find((item) => item.key_text === 'mdTradingSalesInvoice.Title')?.[genLabel]}{' '}
                          </Label>
                          <Input
                            type="text"
                            disabled
                            defaultValue={
                              arb
                                ? invoiceItem && invoiceItem.item_title_arb
                                  ? invoiceItem.item_title_arb
                                  : invoiceItem && invoiceItem.item_title_arb !== null
                                    ? ''
                                    : invoiceItem && invoiceItem.item_title
                                : invoiceItem && invoiceItem.item_title
                            }
                            name={arb ? 'item_title_arb' : 'item_title'}
                          />
                        </td>
                        <td >
                          <Label dir="rtl" style={{ textAlign: 'right' }}>
                            {arabic.find((item) => item.key_text === 'mdTradingSalesInvoice.Unit')?.[genLabel]}{' '}
                          </Label>
                          <Input
                            type="text"
                            disabled
                            defaultValue={
                              arb
                                ? invoiceItem && invoiceItem.unit_arb
                                  ? invoiceItem.unit_arb
                                  : invoiceItem && invoiceItem.unit_arb !== null
                                    ? ''
                                    : invoiceItem && invoiceItem.unit
                                : invoiceItem && invoiceItem.unit
                            }
                            name={arb ? 'unit_arb' : 'unit'}
                          />

                        </td>
                        <td >
                          <Label dir="rtl" style={{ textAlign: 'right' }}>
                            {arabic.find((item) => item.key_text === 'mdTradingSalesInvoice.Unit Price')?.[genLabel]}{' '}
                          </Label>
                          <Input
                            type="text"
                            onChange={(e) => {
                              updateState(index, 'unit_price', e);

                            }}
                            disabled
                            defaultValue={
                              arb
                                ? invoiceItem && invoiceItem.unit_price_arb
                                  ? invoiceItem.unit_price_arb
                                  : invoiceItem && invoiceItem.unit_price_arb !== null
                                    ? ''
                                    : invoiceItem && invoiceItem.unit_price
                                : invoiceItem && invoiceItem.unit_price
                            }
                            name={arb ? 'unit_price_arb' : 'unit_price'}
                          />
                        </td>
                        <td >
                          <Label dir="rtl" style={{ textAlign: 'right' }}>
                            {arabic.find((item) => item.key_text === 'mdTradingSalesInvoice.Ordered Quantity')?.[genLabel]}{' '}
                          </Label>
                          <Input
                            type="text"
                            disabled
                            defaultValue={
                              arb
                                ? invoiceItem && invoiceItem.qty_arb
                                  ? invoiceItem.qty_arb
                                  : invoiceItem && invoiceItem.qty_arb !== null
                                    ? ''
                                    : invoiceItem && invoiceItem.qty
                                : invoiceItem && invoiceItem.qty
                            }
                            name={arb ? 'qty_arb' : 'qty'}
                          />
                        </td>
                        <td>
                        <Label dir="rtl" style={{ textAlign: 'right' }}>
                            {arabic.find((item) => item.key_text === 'mdTradingSalesInvoice.Invoice Quantity')?.[genLabel]}{' '}
                          </Label>
                          <Input
                            type="text"
                            onChange={(e) => {
                              updateState(index, 'project_invoice_qty', e);
                            }}
                            defaultValue={
                              arb
                                ? invoiceItem && invoiceItem.project_invoice_qty_arb
                                  ? invoiceItem.project_invoice_qty_arb
                                  : invoiceItem && invoiceItem.project_invoice_qty_arb !== null
                                    ? ''
                                    : invoiceItem && invoiceItem.project_invoice_qty
                                : invoiceItem && invoiceItem.project_invoice_qty
                            }
                            name={arb ? 'project_invoice_qty_arb' : 'project_invoice_qty'}
                          />
                        </td>
                        <td>
                        <Label dir="rtl" style={{ textAlign: 'right' }}>
                            {arabic.find((item) => item.key_text === 'mdTradingSalesInvoice.Total Amount')?.[genLabel]}{' '}
                          </Label>

                          <Input
                            type="text"
                            onChange={(e) => {
                              updateState(index, 'total_cost', e);
                              handleCalc(invoiceItem.project_invoice_qty, invoiceItem.unit_price);
                            }}
                            defaultValue={
                              arb
                                ? totalAmount ||invoiceItem && invoiceItem.total_cost_arb
                                  ? totalAmount ||invoiceItem.total_cost_arb
                                  : totalAmount ||invoiceItem && invoiceItem.total_cost_arb !== null
                                    ? ''
                                    : totalAmount ||invoiceItem && invoiceItem.total_cost
                                :totalAmount || invoiceItem && invoiceItem.total_cost
                            }
                            name={arb ? 'total_cost_arb' : 'total_cost'}
                            disabled

                          />

                        </td>
                        <td>{invoiceItem.modification_date ? `${invoiceItem.modified_by} (Modified on ${invoiceItem.modification_date})` : `${invoiceItem.created_by} (Created on ${invoiceItem.creation_date})`}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </FormGroup>
        </ModalBody> */}
        <ModalFooter>
          <Button
            color="primary"
            type="button"
            onClick={() => {
              editSalesInvoice();
              setPurchaseOrderEditModal(false);
              // setTimeout(() => {
              //   window.location.reload()
              // }, 100);
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setPurchaseOrderEditModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ProjectPartialInvoiceEdit;
