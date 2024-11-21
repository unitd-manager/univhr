/*eslint-disable*/
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import * as Icon from 'react-feather';
import { ToastContainer } from 'react-toastify';
import {
  Row,
  Col,
  Form,
  FormGroup,
  TabContent,
  TabPane,
  Button,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
import api from '../../constants/api';
import ComponentCard from '../../components/ComponentCard';
import ProjectInvoiceMainDetails from '../../components/ProjectSalesInvoiceTable/ProjectInvoiceMainDetails';
import creationdatetime from '../../constants/creationdatetime';
//import ComponentCardV2 from '../../components/ComponentCardV2';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
// import InvoiceItem from '../../components/BookingTable/InvoiceItem';
// import ItemTable from '../../components/BookingTable/ItemTable';
import ProjectOrderItemTable from '../../components/ProjectSalesInvoiceTable/ProjectOrderItemTable';
import ProjectPartialInvoiceEdit from '../../components/ProjectSalesInvoiceTable/ProjectPartialInvoiceEdit';
import ProjectGoodsItemTable from '../../components/ProjectSalesInvoiceTable/ProjectGoodsItemTable';
import ProjectPartialInvoiceGoodsEdit from '../../components/ProjectSalesInvoiceTable/ProjectPartialInvoiceGoodsEdit';
import AppContext from '../../context/AppContext';
import PdfCreateInvoice from '../../components/PDF/PdfCreateInvoice';
import ApiButton from '../../components/ApiButton';

const InvoiceEdit = () => {
  const [bookingDetails, setBookingDetails] = useState({
    project_invoice_date: new Date().toISOString().split('T')[0],
  });
  // const [editInvoiceItemData, setEditInvoiceItemData] = useState(false);
  // const [itemDetails, setItemDetails] = useState([]);
  const [partialinvoiceeditmodal, setPartialInvoiceEditModal] = useState(false);
  const [partialgoodsinvoiceeditmodal, setPartialGoodsInvoiceEditModal] = useState(false);
  const [orderitemDetails, setOrderItemDetails] = useState([]);
  const { insertedDataId, orderId } = useParams();
  //const [salesOrderDisabled, setSalesOrderDisabled] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  const [update, setUpdate] = useState(false);
  const [qtyMatch, setQtyMatch] = useState([]);

  const { id } = useParams();
  const { loggedInuser } = useContext(AppContext);
  console.log('Invoiceid:', insertedDataId);
  const navigate = useNavigate();
  const [orderdropdown, setOrderDropdown] = useState();
  const [goodsdeliverydropdown, setGoodsDeliveryDropdown] = useState();

  const handleInputs = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const InvoiceSource = bookingDetails.source_type;

  const getDefaultActiveTab = () => {
    if (InvoiceSource === 'Sales_Order') {
      return '1'; // Set to '1' for Sales Invoice Item
    }
    if (InvoiceSource === 'Goods_Delivery') {
      return '2'; // Set to '2' for Goods Invoice Item
    }
    return '3'; // Default to '3' for Attachment
  };

  const [activeTab, setActiveTab] = useState(getDefaultActiveTab);
  // Retrieve visibility states from local storage
  const initialVisibilityStates = JSON.parse(localStorage.getItem('visibilityStates')) || {};

  const [hideButtonVisible, setHideButtonVisible] = useState(
    initialVisibilityStates[insertedDataId] !== true,
  );
  const [displayButtonVisible, setDisplayButtonVisible] = useState(
    initialVisibilityStates[insertedDataId] !== false,
  );
  console.log('companyid', bookingDetails.company_id);
  // Api call for getting sales order dropdown
  const getSalesOrderDropdown = () => {
    api
      .post('/projectsalesinvoice/getSalesOrderDropdown', { company_id: bookingDetails.company_id })
      .then((res) => {
        setOrderDropdown(res.data.data);
      })
      .catch(() => {
        message('Sales Order Data not found', 'info');
      });
  };

  const getSelectedLanguageFromLocalStorage = () => {
    return localStorage.getItem('selectedLanguage') || '';
  };

  const selectedLanguage = getSelectedLanguageFromLocalStorage();

  // Use the selected language value as needed
  console.log('Selected language from localStorage:', selectedLanguage);

  const [arabic, setArabic] = useState([]);

  const arb = selectedLanguage === 'Arabic';

  //const eng = selectedLanguage === 'English';

  const getArabicCompanyName = () => {
    api
      .get('/projectsalesinvoice/getTranslationforProjectSalesInvoice')
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

  //Api call for getting customer dropdown
  const getGoodsDeliveryDropdown = () => {
    api
      .post('/projectsalesinvoice/getGoodsDeliveryDropdown', {
        company_id: bookingDetails.company_id,
      })
      .then((res) => {
        setGoodsDeliveryDropdown(res.data.data);
      })
      .catch(() => {
        message('Goods Delivery Data not found', 'info');
      });
  };
  // const handleInputs = (e) => {
  //   const { name, value } = e.target;
  //   setBookingDetails({ ...bookingDetails, [name]: value });

  //   // Fetch sales order and goods delivery dropdown data whenever company ID changes
  //   if (name === 'company_id') {
  //     getSalesOrderDropdown(value);
  //     getGoodsDeliveryDropdown(value);
  //   }
  // };

  const handleHideButtonClick = () => {
    // Update visibility state for the current ID
    const updatedVisibilityStates = {
      ...initialVisibilityStates,
      [insertedDataId]: true,
    };
    localStorage.setItem('visibilityStates', JSON.stringify(updatedVisibilityStates));

    setHideButtonVisible(false);
    setDisplayButtonVisible(true);
  };

  const handleDisplayButtonClick = () => {
    // Update visibility state for the current ID
    const updatedVisibilityStates = {
      ...initialVisibilityStates,
      [insertedDataId]: false,
    };
    localStorage.setItem('visibilityStates', JSON.stringify(updatedVisibilityStates));

    setDisplayButtonVisible(false);
    setHideButtonVisible(true);
  };

  // Goods delivry button position

  const initialGoodsVisibilityStates = JSON.parse(localStorage.getItem('visibilityStates')) || {};

  const [hideGoodsButtonVisible, setGoodsHideButtonVisible] = useState(
    initialGoodsVisibilityStates[insertedDataId] !== true,
  );
  const [displayGoodsButtonVisible, setDisplayGoodsButtonVisible] = useState(
    initialGoodsVisibilityStates[insertedDataId] !== false,
  );

  const handleGoodsHideButtonClick = () => {
    // Update visibility state for the current ID
    const updatedGoodsVisibilityStates = {
      ...initialGoodsVisibilityStates,
      [insertedDataId]: true,
    };
    localStorage.setItem('visibilityStates', JSON.stringify(updatedGoodsVisibilityStates));

    setGoodsHideButtonVisible(false);
    setDisplayGoodsButtonVisible(true);
  };

  const handleGoodsDisplayButtonClick = () => {
    // Update visibility state for the current ID
    const updatedGoodsVisibilityStates = {
      ...initialGoodsVisibilityStates,
      [insertedDataId]: false,
    };
    localStorage.setItem('visibilityStates', JSON.stringify(updatedGoodsVisibilityStates));

    setDisplayGoodsButtonVisible(false);
    setGoodsHideButtonVisible(true);
  };

  // Function to toggle tabs
  const toggle = (tab) => {
    if (
      (InvoiceSource === 'Sales_Order' && tab === '2') ||
      (InvoiceSource === 'Goods_Delivery' && tab === '1')
    ) {
      // Prevent toggling to other tabs sed on InvoiceSource
      return;
    }

    setActiveTab(tab);
  };

  // Attachment
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  const generateData = () => {
    api
      .post('/projectsalesinvoice/getOrderLineItemsById', { project_order_id: orderId })
      .then((res) => {
        const quoteItems = res.data.data;
        console.log(' Received quote items::', quoteItems);
        if (quoteItems.length === 0) {
          console.warn('No Quote items to insert');
          return;
        }
        // Retrieve all po_product_id  values from the purchase_invoice_items table
        api
          .get('/projectsalesinvoice/checkQuoteItems')
          .then((response) => {
            const ExistingQuoteItemsId = response.data.data;
            const insertQuoteItems = (index) => {
              if (index < quoteItems.length) {
                const QuoteItem = quoteItems[index];
                // Check if the po_product_id  already exists in the ExistingQuoteItemsId array
                if (ExistingQuoteItemsId.includes(QuoteItem.project_order_item_id)) {
                  console.warn(
                    `Quote item for order id  ${QuoteItem.project_order_item_id} already exists, skipping insertion`,
                  );
                  message('Invoice items are already Inserted', 'warning');
                  insertQuoteItems(index + 1);
                } else {
                  // Insert the order item
                  const QuoteItemsData = {
                    creation_date: creationdatetime,
                    created_by: loggedInuser.first_name,
                    project_invoice_id: insertedDataId,
                    qty: QuoteItem.qty,
                    project_invoice_qty: QuoteItem.qty,
                    unit: QuoteItem.unit,
                    unit_price: QuoteItem.unit_price,
                    item_title: QuoteItem.item_title,
                    total_cost: QuoteItem.cost_price,
                    project_order_id: QuoteItem.project_order_id,
                    project_order_item_id: QuoteItem.project_order_item_id,
                    project_invoice_source_id: bookingDetails.project_invoice_source_id,
                    source_type: bookingDetails.source_type,
                    project_quote_id: QuoteItem.project_quote_id,
                  };
                  console.log(`Inserting order item ${index + 1}:`, QuoteItemsData);
                  // Send a POST request to your /goodsreceipt/insertGoodsReceiptItems API with the current QuoteItemsData
                  api
                    .post('/projectsalesinvoice/insertInvoiceItem', QuoteItemsData)
                    .then((result) => {
                      if (result.data.msg === 'Success') {
                        console.log(`Order item ${index + 1} inserted successfully`);
                        setTimeout(() => {
                          window.location.reload();
                        }, 100);
                      } else {
                        console.error(`Failed to insert order item ${index + 1}`);
                      }
                      // Continue to the next item
                      insertQuoteItems(index + 1);
                    })
                    .catch((error) => {
                      console.error(`Error inserting order item ${index + 1}`, error);
                      // Continue to the next item
                      insertQuoteItems(index + 1);
                    });
                }
              } else {
                console.log('All order items inserted successfully');
                // You might want to trigger a UI update here
              }
            };
            // Start inserting order items from index 0
            insertQuoteItems(0);
          })
          .catch((error) => {
            console.error('Error checking order item existence', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching quote items', error);
      });
  };

  const generatePartialData = () => {
    api
      .post('/projectsalesinvoice/getOrderLineItemsById', { project_order_id: orderId })
      .then((res) => {
        const quoteItems = res.data.data;
        console.log(' Received quote items::', quoteItems);
        if (quoteItems.length === 0) {
          console.warn('No Quote items to insert');
          return;
        }
        // Retrieve all po_product_id  values from the purchase_invoice_items table
        api
          .get('/projectsalesinvoice/checkQuoteItems')
          .then((response) => {
            const ExistingQuoteItemsId = response.data.data;
            const insertQuoteItems = (index) => {
              if (index < quoteItems.length) {
                const QuoteItem = quoteItems[index];
                // Check if the po_product_id  already exists in the ExistingQuoteItemsId array
                if (ExistingQuoteItemsId.includes(QuoteItem.project_order_item_id)) {
                  // console.warn(`Quote item for order id  ${QuoteItem.project_order_item_id } already exists, skipping insertion`);
                  // message('Invoice items are already Inserted', 'warning');
                  insertQuoteItems(index + 1);
                } else {
                  // Insert the order item
                  const QuoteItemsData = {
                    creation_date: creationdatetime,
                    created_by: loggedInuser.first_name,
                    project_invoice_id: insertedDataId,
                    qty: QuoteItem.qty,
                    unit_price: QuoteItem.unit_price,
                    item_title: QuoteItem.item_title,
                    total_cost: QuoteItem.cost_price,
                    project_order_id: QuoteItem.project_order_id,
                    project_order_item_id: QuoteItem.project_order_item_id,
                    project_invoice_source_id: bookingDetails.project_invoice_source_id,
                    source_type: bookingDetails.source_type,
                    project_quote_id: QuoteItem.project_quote_id,
                    unit: QuoteItem.unit,
                  };
                  console.log(`Inserting order item ${index + 1}:`, QuoteItemsData);
                  // Send a POST request to your /goodsreceipt/insertGoodsReceiptItems API with the current QuoteItemsData\
                  api
                    .post('/projectsalesinvoice/insertInvoiceItem', QuoteItemsData)
                    .then((result) => {
                      if (result.data.msg === 'Success') {
                        console.log(`Order item ${index + 1} inserted successfully`);
                        setTimeout(() => {
                          window.location.reload();
                        }, 100);
                      } else {
                        console.error(`Failed to insert order item ${index + 1}`);
                      }
                      // Continue to the next item
                      insertQuoteItems(index + 1);
                    })
                    .catch((error) => {
                      console.error(`Error inserting order item ${index + 1}`, error);
                      // Continue to the next item
                      insertQuoteItems(index + 1);
                    });
                }
              } else {
                console.log('All order items inserted successfully');
                // You might want to trigger a UI update here
              }
            };
            // Start inserting order items from index 0
            insertQuoteItems(0);
          })
          .catch((error) => {
            console.error('Error checking order item existence', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching quote items', error);
      });
  };

  const generateGoodsData = () => {
    api
      .post('/projectsalesinvoice/getGoodsLineItemsById', { project_goods_delivery_id: orderId })
      .then((res) => {
        console.log('getGoodsLineItemsById', orderId);
        const quoteItems = res.data.data;
        console.log(' Received quote items::', quoteItems);
        if (quoteItems.length === 0) {
          console.warn('No Quote items to insert');
          return;
        }
        // Retrieve all po_product_id  values from the purchase_invoice_items table
        api
          .get('/projectsalesinvoice/checkGoodsItems')
          .then((response) => {
            const ExistingQuoteItemsId = response.data.data;
            const insertQuoteItems = (index) => {
              if (index < quoteItems.length) {
                const QuoteItem = quoteItems[index];
                // Check if the po_product_id  already exists in the ExistingQuoteItemsId array
                if (ExistingQuoteItemsId.includes(QuoteItem.project_goods_delivery_item_id)) {
                  console.warn(
                    `Quote item for project_goods_delivery_id  ${QuoteItem.project_goods_delivery_item_id} already exists, skipping insertion`,
                  );
                  message('Goods items are already Inserted', 'warning');
                  insertQuoteItems(index + 1);
                } else {
                  // Insert the order item
                  const QuoteItemsData = {
                    creation_date: creationdatetime,
                    created_by: loggedInuser.first_name,
                    project_invoice_id: insertedDataId,
                    qty: QuoteItem.quantity,
                    project_order_id: QuoteItem.project_order_id,
                    unit_price: QuoteItem.unit_price,
                    item_title: QuoteItem.item_title,
                    total_cost: QuoteItem.amount,
                    project_invoice_qty: QuoteItem.quantity,
                    project_goods_delivery_item_id: QuoteItem.project_goods_delivery_item_id,
                    project_goods_delivery_id: QuoteItem.project_goods_delivery_id,
                    project_invoice_source_id: bookingDetails.project_invoice_source_id,
                    source_type: bookingDetails.source_type,
                    project_quote_id: QuoteItem.project_quote_id,
                    unit: QuoteItem.unit,
                  };
                  console.log(`Inserting order item ${index + 1}:`, QuoteItemsData);
                  // Send a POST request to your /goodsreceipt/insertGoodsReceiptItems API with the current QuoteItemsData
                  api
                    .post('/projectsalesinvoice/insertInvoiceItem', QuoteItemsData)
                    .then((result) => {
                      if (result.data.msg === 'Success') {
                        console.log(`Order item ${index + 1} inserted successfully`);
                        setTimeout(() => {
                          window.location.reload();
                        }, 100);
                      } else {
                        console.error(`Failed to insert order item ${index + 1}`);
                      }
                      // Continue to the next item
                      insertQuoteItems(index + 1);
                    })
                    .catch((error) => {
                      console.error(`Error inserting order item ${index + 1}`, error);
                      // Continue to the next item
                      insertQuoteItems(index + 1);
                    });
                }
              } else {
                console.log('All order items inserted successfully');
                // You might want to trigger a UI update here
              }
            };
            // Start inserting order items from index 0
            insertQuoteItems(0);
          })
          .catch((error) => {
            console.error('Error checking order item existence', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching quote items', error);
      });
  };

  const generatePartialGoodsData = () => {
    api
      .post('/projectsalesinvoice/getGoodsLineItemsById', { project_goods_delivery_id: orderId })
      .then((res) => {
        const quoteItems = res.data.data;
        console.log(' Received quote items::', quoteItems);
        if (quoteItems.length === 0) {
          console.warn('No Quote items to insert');
          return;
        }
        // Retrieve all po_product_id  values from the purchase_invoice_items table
        api
          .get('/projectsalesinvoice/checkGoodsItems')
          .then((response) => {
            const ExistingQuoteItemsId = response.data.data;
            const insertQuoteItems = (index) => {
              if (index < quoteItems.length) {
                const QuoteItem = quoteItems[index];
                // Check if the po_product_id  already exists in the ExistingQuoteItemsId array
                if (ExistingQuoteItemsId.includes(QuoteItem.project_goods_delivery_item_id)) {
                  // console.warn(`Quote item for project_goods_delivery_id  ${QuoteItem.project_goods_delivery_item_id } already exists, skipping insertion`);
                  // message('Goods items are already Inserted', 'warning');
                  insertQuoteItems(index + 1);
                } else {
                  // Insert the order item
                  const QuoteItemsData = {
                    creation_date: creationdatetime,
                    created_by: loggedInuser.first_name,
                    project_invoice_id: insertedDataId,
                    qty: QuoteItem.quantity,
                    unit_price: QuoteItem.unit_price,
                    item_title: QuoteItem.item_title,
                    total_cost: QuoteItem.amount,
                    project_order_id: QuoteItem.project_order_id,
                    project_goods_delivery_item_id: QuoteItem.project_goods_delivery_item_id,
                    project_goods_delivery_id: QuoteItem.project_goods_delivery_id,
                    project_invoice_source_id: bookingDetails.project_invoice_source_id,
                    source_type: bookingDetails.source_type,
                    project_quote_id: QuoteItem.project_quote_id,
                    unit: QuoteItem.unit,
                  };
                  console.log(`Inserting order item ${index + 1}:`, QuoteItemsData);
                  // Send a POST request to your /goodsreceipt/insertGoodsReceiptItems API with the current QuoteItemsData
                  api
                    .post('/projectsalesinvoice/insertInvoiceItem', QuoteItemsData)
                    .then((result) => {
                      if (result.data.msg === 'Success') {
                        console.log(`Order item ${index + 1} inserted successfully`);
                        setTimeout(() => {
                          window.location.reload();
                        }, 100);
                      } else {
                        console.error(`Failed to insert order item ${index + 1}`);
                      }
                      // Continue to the next item
                      insertQuoteItems(index + 1);
                    })
                    .catch((error) => {
                      console.error(`Error inserting order item ${index + 1}`, error);
                      // Continue to the next item
                      insertQuoteItems(index + 1);
                    });
                }
              } else {
                console.log('All order items inserted successfully');
                // You might want to trigger a UI update here
              }
            };
            // Start inserting order items from index 0
            insertQuoteItems(0);
          })
          .catch((error) => {
            console.error('Error checking order item existence', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching quote items', error);
      });
  };

  // ... (rest of the code)
  // const generateData = () => {
  //   // Step 1: Delete old order items by project_quote_id
  //   api
  //     .delete(`/finance/deleteinvoice_item/${insertedDataId}`)
  //     .then(() => {
  //       api
  //         .post('/invoice/getOrderLineItemsById', { project_order_id: orderId })
  //         .then((res) => {
  //           const quoteItems = res.data.data;

  //           console.log('Received quote items:', quoteItems);

  //           if (quoteItems.length === 0) {
  //             console.warn('No quote items to insert');
  //             return;
  //           }

  //           // Step 3: Insert new order items based on quote items
  //           const insertInvoiceItems = (index) => {
  //             if (index < quoteItems.length) {
  //               const quoteItem = quoteItems[index];

  //               // Insert the order item
  //               const orderItemData = {
  //                project_invoice_id: insertedDataId,
  //                 qty: quoteItem.qty,
  //                 unit_price: quoteItem.unit_price,
  //                 item_title: quoteItem.item_title,
  //                 total_cost: quoteItem.cost_price,
  //               };

  //               console.log(`Inserting order item ${index + 1}:`, orderItemData);

  //               // Send a POST request to your /finance/insertorder_item API with the current order item
  //               api
  //                 .post('/invoice/insertInvoiceItem', orderItemData)
  //                 .then((result) => {
  //                   if (result.data.msg === 'Success') {
  //                     console.log(`Order item ${index + 1} inserted successfully`);
  //                   } else {
  //                     console.error(`Failed to insert order item ${index + 1}`);
  //                   }
  //                   // Continue to the next item
  //                   insertInvoiceItems(index + 1);

  //                 })
  //                 .catch((error) => {
  //                   console.error(`Error inserting order item ${index + 1}`, error);
  //                   // Continue to the next item
  //                   insertInvoiceItems(index + 1);
  //                 });
  //             } else {
  //               console.log('All order items inserted successfully');
  //               window.location.reload();
  //               // You might want to trigger a UI update here
  //             }
  //           };

  //           // Start inserting order items from index 0
  //           insertInvoiceItems(0);
  //         })
  //         .catch((error) => {
  //           console.error('Error fetching quote items', error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting old order items', error);
  //     });
  // };
  const editBookingById = () => {
    api
      .post('/projectsalesinvoice/getInvoiceById', { project_invoice_id: insertedDataId })
      .then((res) => {
        setBookingDetails(res.data.data[0]);
      })
      .catch(() => {
        message('Invoice Data Not Found', 'info');
      });
  };

  // const editItemById = () => {
  //   api
  //     .post('/invoice/getInvoiceByItemId', { project_invoice_id: insertedDataId })
  //     .then((res) => {
  //       setItemDetails(res.data.data);
  //     })
  //     .catch(() => {
  //       //message('Booking Data Not Found', 'info');
  //     });
  // };
  const getOrderItemById = () => {
    api
      .post('/projectsalesinvoice/getInvoiceByOrderItemId', { project_invoice_id: insertedDataId })
      .then((res) => {
        setOrderItemDetails(res.data.data);
        console.log('setOrderItemDetails', res.data.data);
        const qtymatch = res.data.data.filter((el) => {
          return el.qty !== el.project_invoice_qty;
        });
        setQtyMatch(qtymatch);
        console.log('qtymatch', qtymatch);
      })
      .catch(() => {
        //message('Booking Data Not Found', 'info');
      });
  };
  console.log('qtymatch', qtyMatch);
  const editInvoiceData = (shouldNavigate) => {
    bookingDetails.modification_date = creationdatetime;
    bookingDetails.modified_by = loggedInuser.first_name;
    api
      .post('/projectsalesinvoice/editInvoices', bookingDetails)
      .then(() => {
        message('Record edited successfully', 'success');

        if (shouldNavigate) {
          setTimeout(() => {
            navigate('/ProjectSalesInvoice'); // Navigate after showing the message if shouldNavigate is true
          }, 100);
        }
      })

      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  const backToList = () => {
    navigate('/ProjectSalesInvoice');
  };
  const cancelInvoice = () => {
    if (bookingDetails.status !== 'Paid') {
      bookingDetails.modification_date = creationdatetime;
      const updatedInvoice = { ...bookingDetails, status: 'Cancelled' };
      api
        .post('/projectsalesinvoice/editInvoice', updatedInvoice)
        .then(() => {
          message('Invoice cancelled successfully', 'success');
          window.location.reload();
          editBookingById(); // Refresh the invoice details after updating
          api
            .post(`/finance/updateCancelledStatus/${orderId}`, { order_status: 'Cancelled' })
            .then(() => {
              message('Sales order status updated successfully', 'success');
              //setSalesOrderDisabled(true);
            })
            .catch(() => {
              message('Unable to update sales order status.', 'error');
            });
        })
        .catch(() => {
          message('Unable to cancel invoice.', 'error');
        });
    } else {
      message('Paid invoices cannot be cancelled.', 'info');
    }
  };

  useEffect(() => {
    getSalesOrderDropdown();
    getGoodsDeliveryDropdown();
  }, [bookingDetails.company_id]);

  useEffect(() => {
    editBookingById();
    // editItemById();
    getOrderItemById();
  }, [insertedDataId]);

  return (
    <>
      <BreadCrumbs />
      <FormGroup>
        <ToastContainer />
        <Row>
          <Col>
            {' '}
            <PdfCreateInvoice
              bookingDetails={bookingDetails}
              orderitemDetails={orderitemDetails}
              invoiceId={insertedDataId}
            ></PdfCreateInvoice>
          </Col>
        </Row>

        <ApiButton
          editData={editInvoiceData}
          navigate={navigate}
          applyChanges={editInvoiceData}
          //deleteData={deleteBookingData}
          backToList={backToList}
          module="Invoice"
        ></ApiButton>
      </FormGroup>

      {/*Main Details*/}
      <ComponentCard title="Invoice Details" creationModificationDate={bookingDetails}>
        <ProjectInvoiceMainDetails
          bookingDetails={bookingDetails}
          handleInputs={handleInputs}
          orderdropdown={orderdropdown}
          goodsdeliverydropdown={goodsdeliverydropdown}
          arb={arb}
          arabic={arabic}
        />
      </ComponentCard>

      <ComponentCard title={arb ? 'المزيد من التفاصيل' : 'More Details'}>
        <ToastContainer></ToastContainer>
        <Nav tabs>
          {InvoiceSource !== 'Goods_Delivery' && (
            <NavItem>
              <NavLink onClick={() => toggle('1')} active={activeTab === '1'}>
                {arb ? 'عنصر فاتورة المبيعات' : 'Sales Invoice Item'}
              </NavLink>
            </NavItem>
          )}
          {InvoiceSource !== 'Sales_Order' && (
            <NavItem>
              <NavLink onClick={() => toggle('2')} active={activeTab === '2'}>
                {arb ? 'بند فاتورة البضائع' : 'Goods Invoice Item'}
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <NavLink onClick={() => toggle('3')} active={activeTab === '3'}>
              {arb ? 'مرفق' : 'Attachment'}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1">
            <Row className="mb-4">
              <Col md="3">
                {hideButtonVisible &&
                  ((hideButtonVisible && orderitemDetails.length === 0) ||
                    (orderitemDetails.length > 0 && qtyMatch.length > 0)) && (
                    <Button
                      color="primary"
                      className="shadow-none"
                      onClick={() => {
                        generateData();
                        handleDisplayButtonClick();
                      }}
                    >
                      {arb ? 'إنشاء فاتورة كاملة' : 'Create Full Invoice'}
                    </Button>
                  )}
              </Col>
              <Col md="3">
                <ProjectPartialInvoiceEdit
                  partialinvoiceeditmodal={partialinvoiceeditmodal}
                  setPartialInvoiceEditModal={setPartialInvoiceEditModal}
                  SalesInvoiceId={insertedDataId}
                  arb={arb}
                  arabic={arabic}
                ></ProjectPartialInvoiceEdit>
                {displayButtonVisible &&
                  ((displayButtonVisible && orderitemDetails.length === 0) ||
                    (orderitemDetails.length > 0 && qtyMatch.length > 0)) && (
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        generatePartialData();
                        setPartialInvoiceEditModal(true);
                        handleHideButtonClick();
                      }}
                    >
                      {arb ? 'إنشاء فاتورة جزئية' : 'Create Partial Invoice'}
                    </Button>
                  )}
              </Col>
            </Row>
            <ProjectOrderItemTable orderitemDetails={orderitemDetails} qtyMatch={qtyMatch} />
          </TabPane>

          <TabPane tabId="2">
            <Row className="mb-4">
              <Col md="3">
                {hideGoodsButtonVisible &&
                  ((hideGoodsButtonVisible && orderitemDetails.length === 0) ||
                    (orderitemDetails.length > 0 && qtyMatch.length > 0)) && (
                    <Button
                      color="primary"
                      className="shadow-none"
                      onClick={() => {
                        generateGoodsData();
                        handleGoodsDisplayButtonClick();
                      }}
                    >
                      {arb ? 'إنشاء فاتورة كاملة' : 'Create Full Invoice'}
                    </Button>
                  )}
              </Col>
              <Col md="3">
                <ProjectPartialInvoiceGoodsEdit
                  partialgoodsinvoiceeditmodal={partialgoodsinvoiceeditmodal}
                  setPartialGoodsInvoiceEditModal={setPartialGoodsInvoiceEditModal}
                  SalesInvoiceId={insertedDataId}
                  arb={arb}
                  arabic={arabic}
                ></ProjectPartialInvoiceGoodsEdit>
                {displayGoodsButtonVisible &&
                  ((displayGoodsButtonVisible && orderitemDetails.length === 0) ||
                    (orderitemDetails.length > 0 && qtyMatch.length > 0)) && (
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        setPartialGoodsInvoiceEditModal(true);
                        generatePartialGoodsData();
                        handleGoodsHideButtonClick();
                      }}
                    >
                      {arb ? 'إنشاء فاتورة جزئية' : 'Create Partial Invoice'}
                    </Button>
                  )}
              </Col>
            </Row>
            <ProjectGoodsItemTable orderitemDetails={orderitemDetails} arb={arb} arabic={arabic} />
          </TabPane>

          <TabPane tabId="3">
            <Form>
              <FormGroup>
                <Row>
                  <Col xs="12" md="3" className="mb-3">
                    <Button
                      className="shadow-none"
                      color="primary"
                      onClick={() => {
                        setRoomName('SalesInvoice');
                        setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                        dataForAttachment();
                        setAttachmentModal(true);
                      }}
                    >
                      <Icon.File className="rounded-circle" width="20" />
                    </Button>
                  </Col>
                </Row>
                <AttachmentModalV2
                  moduleId={id}
                  attachmentModal={attachmentModal}
                  setAttachmentModal={setAttachmentModal}
                  roomName={RoomName}
                  fileTypes={fileTypes}
                  altTagData="SalesInvoiceRequestRelated Data"
                  desc="SalesInvoiceRequestRelated Data"
                  recordType="RelatedPicture"
                  mediaType={attachmentData.modelType}
                  update={update}
                  setUpdate={setUpdate}
                  arb={arb}
                  arabic={arabic}
                />
                <ViewFileComponentV2
                  moduleId={id}
                  roomName="SalesInvoice"
                  recordType="RelatedPicture"
                  update={update}
                  setUpdate={setUpdate}
                  arb={arb}
                  arabic={arabic}
                />
              </FormGroup>
            </Form>
          </TabPane>
        </TabContent>
      </ComponentCard>
    </>
  );
};

export default InvoiceEdit;
