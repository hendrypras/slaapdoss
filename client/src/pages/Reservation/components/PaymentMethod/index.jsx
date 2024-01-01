import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { selectPaymentMethod } from '@pages/Reservation/actions';

import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const PaymentMethod = ({ methodList, methodSelected }) => {
  const dispatch = useDispatch();
  return (
    <div className={classes.wrapperPaymentMethod}>
      <div className={classes.headTitle}>
        <FormattedMessage id="app_reservation_payment_method_title" />
      </div>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          className={classes.summary}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <FormattedMessage id="app_reservation_virtual_account_title" />
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          {methodList?.map((val, i) => (
            <div
              hidden
              key={i}
              className={classNames({
                [classes.wrapperCotentDetails]: true,
                [classes.wrapperSelected]: methodSelected?.bank === val?.method || false,
              })}
              onClick={() => dispatch(selectPaymentMethod({ paymentType: val?.type, bank: val?.method }))}
            >
              <img src={val?.icon_url} alt="icon" className={classes.icon} />
              <div className={classes.content}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={methodSelected?.bank === val?.method}
                  onChange={() => dispatch(selectPaymentMethod({ paymentType: val?.type, bank: val?.method }))}
                  className={classes.radioButton}
                />
                <HeadTitle className={classes.title} title={val?.type_label} />
                <div className={classes.desc}>
                  <FormattedMessage id={val?.instraction?.desc} />
                </div>
                <Accordion className={classes.accordionStep}>
                  <AccordionSummary
                    className={classes.summary}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    ATM
                  </AccordionSummary>
                  {Object.values(val?.instraction?.atm?.step)?.map((step, stepIndex) => (
                    <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                      <div className={classes.number}>{stepIndex + 1}</div>
                      <div className={classes.stepText}>
                        <FormattedMessage id={step} />
                      </div>
                    </AccordionDetails>
                  ))}
                </Accordion>
                {val?.instraction && val?.instraction?.internet_banking && (
                  <Accordion className={classes.accordionStep}>
                    <AccordionSummary
                      className={classes.summary}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Internet Banking
                    </AccordionSummary>
                    {Object.values(val?.instraction?.internet_banking?.step)?.map((step, stepIndex) => (
                      <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                        <div className={classes.number}>{stepIndex + 1}</div>
                        <div className={classes.stepText}>
                          <FormattedMessage id={step} />
                        </div>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                )}
                {val?.instraction && val?.instraction?.klik_bca && (
                  <Accordion className={classes.accordionStep}>
                    <AccordionSummary
                      className={classes.summary}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      Klick BCA
                    </AccordionSummary>
                    {Object.values(val?.instraction?.klik_bca?.step)?.map((step, stepIndex) => (
                      <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                        <div className={classes.number}>{stepIndex + 1}</div>
                        <div className={classes.stepText}>
                          <FormattedMessage id={step} />
                        </div>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                )}
                {val?.instraction && val?.instraction?.m_bca && (
                  <Accordion className={classes.accordionStep}>
                    <AccordionSummary
                      className={classes.summary}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      M BCA
                    </AccordionSummary>
                    {Object.values(val?.instraction?.m_bca?.step)?.map((step, stepIndex) => (
                      <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                        <div className={classes.number}>{stepIndex + 1}</div>
                        <div className={classes.stepText}>
                          <FormattedMessage id={step} />
                        </div>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                )}
                {val?.instraction && val?.instraction?.m_banking && (
                  <Accordion className={classes.accordionStep}>
                    <AccordionSummary
                      className={classes.summary}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      M Banking
                    </AccordionSummary>
                    {Object.values(val?.instraction?.m_banking?.step)?.map((step, stepIndex) => (
                      <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                        <div className={classes.number}>{stepIndex + 1}</div>
                        <div className={classes.stepText}>
                          <FormattedMessage id={step} />
                        </div>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                )}
              </div>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
PaymentMethod.propTypes = {
  methodSelected: PropTypes.object,
  methodList: PropTypes.array,
};
export default PaymentMethod;
