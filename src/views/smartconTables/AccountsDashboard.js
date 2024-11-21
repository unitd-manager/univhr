import React from 'react';
import { Col, Row } from 'reactstrap';
import JournalAccountsChart from './JournalAccountsChart';
import JournalAccountsChart1 from './JournalAccountsChart1';
import LedgerChart from './LedgerChart';
import CreditNoteChart from './CreditNoteChart';
import DebitNoteChart from './DebitNoteChart';
import BalanceSheetChart from './BalanceSheetChart';
import ExpensesOverTimeChart from './ExpensesOverTimeChart';
import CreditNotrAgingChart from './CreditNotrAgingChart';
import DebitNoteStatusChart from './DebitNoteStatusChart';

const Test = () => {

  return (
    <div >
      <Row>
        <Col lg='12'>
        <BalanceSheetChart/>
        <ExpensesOverTimeChart/>
        <CreditNotrAgingChart/>
        <DebitNoteStatusChart/>
        <JournalAccountsChart/>
        <JournalAccountsChart1/>
        <LedgerChart/>
        <CreditNoteChart/>
        <DebitNoteChart/>
       
        </Col>
      </Row>
  
    </div>
  );
};

export default Test;
