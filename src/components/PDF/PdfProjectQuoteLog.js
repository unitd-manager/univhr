import React,{useState} from 'react';
import pdfMake from 'pdfmake';
import * as Icon from 'react-feather';
//import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import api from '../../constants/api';
//import message from '../Message';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';


const PdfProjectQuoteLog = ({id,logId}) => {
  PdfProjectQuoteLog.propTypes = {
    id: PropTypes.any,
    logId:PropTypes.any,
  }
  const [hfdata, setHeaderFooterData] = React.useState();
   const [gTotal, setGtotal] = React. useState(0);
  //  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [lineItem, setLineItem] = useState([]);
  const [projectDetail,setProjectDetail]=useState([]);

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);

  const findCompany = (key) => {
    const filteredResult = hfdata.find((e) => e.key_text === key);
    return filteredResult.value;
  };

  const getProjectById = () => {
    api
      .post('/tradingquote/getTradingquoteById', { quote_id: id })
      .then((res) => {
        setProjectDetail(res.data.data);
        console.log('quote5', res.data.data);

      })
      .catch(() => {});
  };

  // Get Quote By Id
  const getQuote = () => {
    api.post('/project/getTabQuotelogsById', { quote_id: id }).then((res) => {
      setQuotation(res.data.data[0]);
      console.log('quote2', res.data.data);
    });
  };
  
  const getQuoteById = () => {
    api
      .post('/project/getTabQuoteLineItems', { quote_log_id: logId })
      .then((res) => {
        setLineItem(res.data.data);
        let grandTotal = 0;
        
        res.data.data.forEach((elem) => {
          grandTotal += elem.amount;
          //  grand += elem.actual_value;
        });
        setGtotal(grandTotal);
        
        //setViewLineModal(true);
      })
      .catch(() => {});
  };
  React.useEffect(() => {
    getQuote();
    getQuoteById();
    getProjectById();
    //getQuote1();
  }, []);


  const GetPdf = () => {
    
   
    const LineItemBody = [
      [
        {
          text: 'SN',
          style: 'tableHead',
        },
        {
          text: 'Title',
          style: 'tableHead',
        },
        {
          text: 'Description',
          style: 'tableHead',
        },
        
        {
          text: 'Amt S$',
          style: 'tableHead',
        },
       
      ],
    ];
    lineItem.forEach((element,index) => {
      LineItemBody.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.title}`,
          border: [false, false, false, true],
          style: 'tableBody1',
        },
        {
          text: `${element.description}`,
          border: [false, false, false, true],
          style: 'tableBody1',
        },
        {
          text: `${element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          fillColor: '#f5f5f5',
          style: 'tableBody2',
        },
     
      ]);
    });

    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
        pageMargins: [40, 150, 40, 80],
        footer: PdfFooter,
      content: [
    
        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['101%',],

            body: [
              [
                {
                  text: `Quotation`,
                  alignment: 'center',
                  style: 'tablehead',
                },
              ],
            ],
          },
        },
        '\n',
        
        {
          columns: [
            {
              stack: [
                {text:` Co Name  :   ${projectDetail.company_name?projectDetail.company_name:''} `,style: [ 'textSize'], },
                {text:` Address    :   ${projectDetail.address_street ? projectDetail.address_street : ''}`,style: [ 'textSize']},
                {text: `               ${projectDetail.address_town?projectDetail.address_town:''}`,style: [ 'textSize'],margin:[57,0,0,0]},
                {text: `               ${projectDetail.address_country ? projectDetail.address_country : ''}-${projectDetail.address_po_code ? projectDetail.address_po_code : ''}`,style: [ 'textSize'],margin:[57,0,0,0]},
                {text:` Email        :   ${projectDetail.email?projectDetail.email:''} `,style: [ 'textSize'],  },
                {text:` Tel.            :   ${projectDetail.phone?projectDetail.phone:''}`,style: [ 'textSize'],  },
              ],
            },
            {
              stack: [
                {text:`  Quote Date       :  ${(quotation.quote_date)? moment(quotation.quote_date).format('DD-MM-YYYY'):''} `,style: [ 'textSize'],margin:[83,0,0,0]  },
                {text:` Quote code       :  ${quotation.quote_code?quotation.quote_code:''} `,style: [ 'textSize'],margin:[83,0,0,0]   },
              
                
              
              ],
            },
          ],
        },
        '\n',
        {
          stack: [
            
            {text:`Project Reference : ${quotation.project_reference?quotation.office_ref_no:''} `,style: [ 'textSize'],  },
            {text:`roject Location  : ${quotation.project_location?quotation.project_location:''} `,style: [ 'textSize'],  },
          ],
        },'\n\n\n',
     
      

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function () { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: [30, 140, 145, 120],

            body: LineItemBody,
          },
        },
       
       '\n\n',
      
        {
          text: `TOTAL EXCLUDING VAT : ${gTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} `,
          alignment: 'right',
          margin: [0, 0, 41, 0],
          bold: true,
          fontSize: 9.5,
        }, '\n\n\n\n\n',

        {
          width: '100%',
          alignment: 'left',
          text: 'Other Comments or Special Instructions ',
          color:'Black',
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 10,
        },'\n',
        {
          width: '100%',
          alignment: 'left',
          text: ':-  Payment : COD',
          fontSize: 10,
        },'\n',
        {
          width: '100%',
          alignment: 'left',
          text: ':- The above quote does not cover replacement of any parts unless expressly stated above.',
          fontSize: 10,
        },'\n',
        {
          width: '100%',
          alignment: 'left',
          text: ':- We reserve the right to terminate any scope of work in event where there is a default to our Payment Schedule.',
          fontSize: 10,
        },
       
        '\n\n\n',
        {text:`Your's Faithfully,`,
            width: '100%',
            alignment: 'left',
          fontSize:10},
          '\n\n\n',
       
        {
          columns: [
            
            {
              stack: [
          
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 210, y2: 0, lineWidth: 1 }] },
                {
                  text: `Authorised Signature / Date `,
                  fontSize: 10,
                  style: ['textSize'],
                  margin: [0, 0, 0, 0],
                },
              ],
            },
            {
              stack: [
          
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 210, y2: 0, lineWidth: 1 }] },
                {
                  text: `Accepted By / Date`,
                  fontSize: 10,
                  style: ['textSize'],
                  margin: [0, 0, 0, 0],
                },
              ],
            },
          ],
          columnGap: 60,
        },
      ],
      margin: [0, 50, 50, 50],

      styles: {
        logo: {
          margin: [-20, 20, 0, 0],
        },
        address: {
          margin: [-10, 20, 0, 0],
        },
        invoice: {
          margin: [0, 30, 0, 10],
          alignment: 'right',
        },
        invoiceAdd: {
          alignment: 'right',
        },
        textSize: {
          fontSize: 10,
        },
        notesTitle: {
          bold: true,
          margin: [0, 50, 0, 3],
        },
        tableHead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 11,
          bold: 'true',
        },
        tablehead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 13,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10.5,
        },
        tableBody1: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'center',
          fontSize: 10,
        },
        tableBody2: {
          border: [false, false, false, true],
          margin: [0, 5, 35, 5],
          alignment: 'right',
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
     <span onClick={GetPdf}><Icon.Printer/></span>
    </>
    
  );
};

export default PdfProjectQuoteLog;
