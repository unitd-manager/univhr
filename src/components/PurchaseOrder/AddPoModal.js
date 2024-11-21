import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from 'reactstrap';
import PropTypes from 'prop-types';
import * as $ from 'jquery';
import random from 'random';
import Select from 'react-select';
import api from '../../constants/api';
import message from '../Message'
import creationdatetime from '../../constants/creationdatetime';

const AddPoModal = ({
  projectId,
  supplierId,
  addPurchaseOrderModal,
  setAddPurchaseOrderModal,
  PurchaseOrderId,
}) => {
  AddPoModal.propTypes = {
    addPurchaseOrderModal: PropTypes.bool,
    projectId: PropTypes.string,
    supplierId: PropTypes.any,
    PurchaseOrderId: PropTypes.any,
    setAddPurchaseOrderModal: PropTypes.func,
  };
  const [unitdetails, setUnitDetails] = useState();
  const getSelectedLanguageFromLocalStorage = () => {
    return localStorage.getItem('selectedLanguage') || '';
  };
  
const selectedLanguage = getSelectedLanguageFromLocalStorage();

// Use the selected language value as needed
console.log('Selected language from localStorage:', selectedLanguage);

const arb =selectedLanguage === 'Arabic'

  // const eng =selectedLanguage === 'English'

  const [arabic, setArabic] = useState([]);

  const getArabicLabel = () => {
    api
    .get('/purchaseorder/getTranslationForPurchaseOrder')
    .then((res) => {
      setArabic(res.data.data);
    })
    .catch(() => {
      // Handle error if needed
    });   
};
let genLabel = '';

if (arb === true) {
  genLabel = 'arb_value';
} else {
  genLabel = 'value';
}
  const getUnit = () => {
    api.get('/product/getUnitFromValueList').then((res) => {
      const items = res.data.data;
      const options = items.map((item) => ({
        value: item.value,
        label: item.value,
      }));
      // Set the unit options
      setUnitDetails(options);
    })
    .catch((error) => {
      console.error('Error fetching unit data:', error);
    });
  };
  
  // Fetch data from API
//   const getUnit = () => {
//     api.get('/product/getUnitFromValueList', unitdetails).then((res) => {
//       const items = res.data.data;
//      
//       const finaldat = [];
  //     items.forEach((item) => {
  //       finaldat.push({ value: item.value, label: item.value });
  //     });
  //     setUnitDetails(finaldat);
  //   });
  // }

  const [addNewProductModal, setAddNewProductModal] = useState(false);
   const [getProductValue, setProductValue] = useState();
  const [productDetail, setProductDetail] = useState({
    category_id: null,
    sub_category_id: null,
    title: '',
    product_code: '',
    qty_in_stock: null,
    price: null,
    published: 0,
  });
  const [addMoreItem, setMoreItem] = useState([
    {
      id: random.int(1, 99).toString(),
      itemId: '',
      unit: '',
      qty: '',
      price: '',
      mrp: '',
      gst: '',
      description: '',
    },
    {
      id: random.int(0, 9999).toString(),
      itemId: '',
      unit: '',
      qty: '',
      price: '',
      mrp: '',
      gst: '',
      description: '',
    },
    {
      id: random.int(0, 9999).toString(),
      itemId: '',
      unit: '',
      qty: '',
      price: '',
      mrp: '',
      gst: '',
      description: '',
    },
  ]);

  

  const AddNewLineItem = () => {
    setMoreItem([
      ...addMoreItem,
      {
        id: random.int(0, 9999).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: '',
        description: '',
      },
    ]);
  };

  const [insertPurchaseOrderData] = useState({
    po_code: '',
    supplier_id: supplierId,
    contact_id_supplier: '',
    delivery_terms: '',
    status: 'test',
    project_id: projectId,
    flag: 1,
    creation_date: new Date(),
    modification_date: new Date(),
    created_by: '1',
    modified_by: '1',
    supplier_reference_no: '',
    our_reference_no: '',
    shipping_method: '',
    payment_terms: '',
    delivery_date: '',
    po_date: '',
    shipping_address_flat: '',
    shipping_address_street: '',
    shipping_address_country: '',
    shipping_address_po_code: '',
    expense_id: 0,
    staff_id: 0,
    purchase_order_date: new Date(),
    payment_status: '0',
    title: 'Purchase Order',
    priority: '1',
    follow_up_date: new Date(),
    notes: 'test',
    supplier_inv_code: '',
    gst: 0,
    gst_percentage: '10%',
    delivery_to: '',
    contact: '',
    mobile: '',
    payment: '0',
    project: '',
  });

  const handleNewProductDetails = (e) => {
    setProductDetail({ ...productDetail, [e.target.name]: e.target.value });
  };


 const getProduct = () => {
  api.get('/product/getProducts').then((res) => {
    const items = res.data.data;
    const finaldat = [];
    items.forEach((item) => {
      finaldat.push({ value: item.product_id, label: item.title });
    });
    setProductValue(finaldat);
  });
};

const insertProduct = (ProductCode, ItemCode) => {
  if (productDetail.title !== '' || productDetail.title_arb !== ''){
    productDetail.product_code = ProductCode;
    productDetail.item_code = ItemCode;
    productDetail.creation_date = creationdatetime;
    api
      .post('/purchaseorder/insertPurchaseProduct', productDetail)
      .then((res) => {
        const insertedDataId = res.data.data.insertId;
        message('Product inserted successfully.', 'success');
        api
          .post('/product/getCodeValue', { type: 'InventoryCode' })
          .then((res1) => {
            const InventoryCode = res1.data.data;
            message('inventory created successfully.', 'success');
            api
            .post('/inventory/insertinventory', { product_id: insertedDataId, inventory_code:InventoryCode  })
          
          .then(() => {
            message('inventory created successfully.', 'success');
             getProduct();
          })
          })
          .catch(() => {
            message('Unable to create inventory.', 'error');
          });
      })
      .catch(() => {
        message('Unable to insert product.', 'error');
      });
    } else {
      message('Please fill the Product Name ', 'warning');
    }
  };
  const handleChange = (index, selectedOption) => {
    const updatedItems = [...addMoreItem];
    updatedItems[index].unit = selectedOption.value;
    setMoreItem(updatedItems);
  };
  
  //Auto generation code
  const generateCode = () => {
    api
      .post('/product/getCodeValue', { type: 'ProductCode' })
      .then((res) => {
        const ProductCode = res.data.data
      api
      .post('/product/getCodeValue', { type: 'ItemCode' })
      .then((response) => {
        const ItemCode = response.data.data
        insertProduct(ProductCode, ItemCode);
      })
      })
      .catch(() => {
        insertProduct('');
      });
  };

  // Materials Purchased
  const TabMaterialsPurchased = () => {
    api
      .get('/purchaseorder/TabPurchaseOrderLineItem')
      .then((res) => {
        const items = res.data.data;
        const finaldat = [];
        items.forEach((item) => {
          finaldat.push({ value: item.product_id, label: item.title });
        });
      })
      .catch(() => {
        message('Tab Purchase Order not found', 'info');
      });
  };
  const poProduct = (itemObj) => {
    api
      .post('/purchaseorder/insertPoProduct', {
        purchase_order_id: PurchaseOrderId,
        item_title: itemObj.title,
        item_title_arb: itemObj.title_arb,
        quantity: itemObj.qty,
        unit: itemObj.unit,
        amount: 0,
        description: itemObj.description,
        creation_date: new Date(),
        modification_date: new Date(),
        created_by: '1',
        modified_by: '1',
        status: 'In Progress',
        cost_price: itemObj.cost_price,
        selling_price: itemObj.mrp,
        qty_updated: parseInt(itemObj.qty, 10),
        qty: parseInt(itemObj.qty, 10),
        product_id: itemObj.product_id,
        supplier_id: insertPurchaseOrderData.supplier_id,
        gst: itemObj.gst,
        damage_qty: 0,
        brand: '',
        qty_requested: 0,
        qty_delivered: 0,
        price: itemObj.price,
      })
      .then(() => {
        message('Product Added!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      })
      .catch(() => {
        message('Unable to add Product!', 'error');
      });
  };

  const getAllValues = () => {
    const result = [];
    const oldArray = addMoreItem;
    $('.lineitem tbody tr').each(() => {
      const allValues = {};
      $(this)
        .find('input')
        .each(() => {
          const fieldName = $(this).attr('name');
          allValues[fieldName] = $(this).val();
        });
      result.push(allValues);
    });
    oldArray.forEach((obj) => {
      if (obj.id) {
        /* eslint-disable */
        // const objId = parseInt(obj.id)
        const foundObj = oldArray.find((el) => el.id === obj.id);
        if (foundObj) {
          obj.product_id = foundObj.product_id;
          obj.title = foundObj.title;
          obj.item_title = foundObj.item_title;
        }
        if(obj.unit){
          poProduct(foundObj);
          }
      }
    });

  };

  function updateState(index, property, e) {
    const copyDeliverOrderProducts = [...addMoreItem];
    const updatedObject = { ...copyDeliverOrderProducts[index], [property]: e.target.value };
    copyDeliverOrderProducts[index] = updatedObject;
    setMoreItem(copyDeliverOrderProducts);
  }

  useEffect(() => {
     getProduct();
    TabMaterialsPurchased();
    getArabicLabel();
  }, []);
  useEffect(() => {
    setMoreItem([
      {
        id: random.int(1, 99).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: '',
        description: '',
      },
      {
        id: random.int(0, 9999).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: '',
        description: '',
      },
      {
        id: random.int(0, 9999).toString(),
        itemId: '',
        unit: '',
        qty: '',
        price: '',
        mrp: '',
        gst: '',
        description: '',
      },
    ]);
  }, [addPurchaseOrderModal]);

  const onchangeItem = (selectedOption, itemId) => {
    const updatedItems = addMoreItem.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          title: selectedOption.label,
          item_title: selectedOption.label,
          product_id: selectedOption.value.toString(),
        };
      }
      return item;
    });
    setMoreItem(updatedItems);
  };
  
  // const onchangeItem = (str, itemId) => {
  //   const element = addMoreItem.find((el) => el.id === itemId);
  //   element.title = str.label;
  //   element.item_title = str.label;
  //   element.product_id = str.value.toString();
  //   setMoreItem(addMoreItem);
  // };

  // Clear row value
  const ClearValue = (ind) => {
    setMoreItem((current) =>
      current.filter((obj) => {
        return obj.id !== ind.id;
      }),
    );
  };
  const columns = [
  
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Item')?.[genLabel],
  
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Unit')?.[genLabel],
  
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Quantity')?.[genLabel],
   
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Cost Price')?.[genLabel],
    
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.Selling Price')?.[genLabel],
  
    },
    {
      name: arabic.find(item => item.key_text === 'mdPurchaseOrder.VAT')?.[genLabel],
     
    },
  ];
  useEffect(() => {
    getUnit();
    
  }, []);

  return (
    <>
      <Modal size="xl" isOpen={addPurchaseOrderModal}>
        <ModalHeader>Add Product</ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <Col md="3">
                    <Button
                      color="primary"
                      className="shadow-none"
                      onClick={() => {
                        setAddNewProductModal(true);
                      }}
                    >
                      Add New Product
                    </Button>
                  </Col>
                  <Col md="3">
                    <Button
                      color="primary"
                      className="shadow-none"
                      onClick={() => {
                        AddNewLineItem();
                      }}
                    >
                      Add Item
                    </Button>
                  </Col>
                </Row>
                <br />
              </Col>
            </Row>

            <table className="lineitem">
              <thead>
              <tr>
              {columns.map((col) => (
                <th key={col.selector}>{col.name}</th>
              ))}
            </tr>
              </thead>
              <tbody>
                {addMoreItem.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td data-label="title">
                        <Select
                          key={item.id}
                         defaultValue={{ value: item.product_id, label: arb ? item.title_arb : item.title }}
                          onChange={(e) => {
                            onchangeItem(e, item.id);
                          }}
                          options={getProductValue}
                        />
                        <Input value={item.product_id} type="hidden" name="product_id"></Input>
                        <Input value={item.title} type="hidden" name="title"></Input>
                        
                      </td>

                      {/* <td data-label="Unit">
                         <Input
                          defaultValue={item.uom}
                          type="text"
                          name="unit"
                          onChange={(e) => updateState(index, 'unit', e)}
                          value={insertPurchaseOrderData && insertPurchaseOrderData.unit}
                        
                        /> 
                        </td> 
                      <td>
  <Select
    name="unit"
    value={item.unit ? { value: item.unit, label: item.unit } : null}
    onChange={(selectedOption) => updateState(index, 'unit', selectedOption)}
    options={unitdetails}
  />
</td>*/}
<td>
  <Select
    name="unit"
    value={item.unit ? { value: item.unit, label: item.unit } : null}
    onChange={(selectedOption) => handleChange(index, selectedOption)}
    options={unitdetails}
  />
</td>


                      <td data-label="Qty">
                        <Input
                          defaultValue={item.qty}
                          type="number"
                          name="qty"
                          onChange={(e) => updateState(index, 'qty', e)}
                          value={insertPurchaseOrderData && insertPurchaseOrderData.qty}
                        />
                      </td>
                      <td data-label="Cost Price">
                        <Input
                          type="number"
                          defaultValue={item.cost_price}
                          onChange={(e) => updateState(index, 'cost_price', e)}
                          value={insertPurchaseOrderData && insertPurchaseOrderData.cost_price}
                          name="cost_price"
                        />
                      </td>
                      <td data-label="Selling Price">
                        <Input
                          type="input"
                          defaultValue={item.price}
                          name="mrp"
                          onChange={(e) => updateState(index, 'mrp', e)}
                          value={insertPurchaseOrderData && insertPurchaseOrderData.mrp}
                        />
                      </td>
                      <td data-label="VAT">
                      <Input
  type="number"
  defaultValue={item.gst}
  name="gst"
  onChange={(e) => updateState(index, 'gst', e)}
  value={item.gst} // Use item.gst here
/>

                      </td>
                      <td data-label="Action">
                        {' '}
                        <Input defaultValue={item.id} type="hidden" name="id"></Input>
                          <div className="anchor">
                            <span
                              onClick={() => {
                                ClearValue(item);
                              }}
                            >
                              Clear
                            </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              getAllValues();
              getProduct();
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setAddPurchaseOrderModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add New Product Modal */}
      <Modal isOpen={addNewProductModal}>
        <ModalHeader>Add New Products</ModalHeader>

        <ModalBody>
          <FormGroup>
            <Row>
              <Col md="12" className="mb-4">
                <Row>
                  <FormGroup>
                    <Row>
                    <Label dir="rtl" style={{ textAlign: 'left' }}>
                {arabic.find((item) => item.key_text === 'mdPurchaseOrder.Product Name')?.[genLabel]}<span className="required"> *</span>
              </Label>
                    
                      <Col sm="8">
                      <Input
                type="text"
                onChange={handleNewProductDetails}
                value={
                  arb
                    ? (
                        productDetail && productDetail.title_arb ? productDetail.title_arb :
                        (productDetail && productDetail.title_arb !== null ? '' : productDetail && productDetail.title)
                      )
                    : (productDetail && productDetail.title)
                }
                name={arb ? 'title_arb': 'title'}
              />
                       
                      </Col>
                    </Row>
                  </FormGroup>
                </Row>
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              setAddNewProductModal(false);
              generateCode();
              getProduct();
              setTimeout(() => {
                window;
              }, 300);
            }}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setAddNewProductModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddPoModal;
