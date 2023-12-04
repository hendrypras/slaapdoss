import { FormattedMessage } from 'react-intl';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import logo from '@static/images/success-payment.svg';

import { selectResponsePayment } from '@pages/PaymentResponse/selectors';
import { getResponsePaymentById } from '@pages/PaymentResponse/actions';

import Container from '@components/Container';

import formatCountdown from '@utils/formatCountdown';
import copyTextToClipboadrd from '@utils/copyTextToClipboadrd';

import classes from './style.module.scss';

const PaymentResponse = ({ responsePayment }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, status } = useParams();
  const [countdown, setCountdown] = useState(0);
  const timerId = useRef();
  const VAnumber = responsePayment?.va_numbers?.length
    ? responsePayment?.va_numbers[0]?.va_number
    : responsePayment?.va_number;
  useEffect(() => {
    if (
      orderId &&
      status === 'success' &&
      Object.keys(responsePayment).length === 0 &&
      responsePayment.constructor === Object
    ) {
      dispatch(getResponsePaymentById(orderId));
    }
  }, [dispatch, status, orderId, responsePayment]);
  useEffect(() => {
    const targetTime = new Date(responsePayment?.expiry_time).getTime() / 1000; // Konversi prop seconds menjadi timestamp dalam detik
    const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
    const remainingSeconds = targetTime - currentTime; // Jumlah detik yang tersisa

    if (remainingSeconds <= 0) {
      clearInterval(timerId.current);
      setCountdown(0);
    } else {
      setCountdown(remainingSeconds);

      timerId.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerId.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerId.current);
    };
  }, [responsePayment]);
  // useEffect(() => {
  //   const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
  //   const clientKey = 'c79da583-5675-4635-8906-e766993011d6';
  //   const script = document.createElement('script');
  //   script.src = snapScript;
  //   script.setAttribute('data-client-key', clientKey);
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <Container className={classes.wrapper}>
      <>
        <img className={classes.image} src={logo} alt="Not Found" />
        <div className={classes.title}>
          <FormattedMessage id="app_respose_payment_success" />
        </div>
        <div className={classes.wrapperContent}>
          <div className={classes.wrapperCountdown}>
            <div>
              <FormattedMessage id="app_response_payment_pay_in" />
            </div>
            <div className={classes.countdown}>{formatCountdown(countdown)}</div>
          </div>
          <div className={classes.wrapperVA}>
            <div className={classes.title}>No Virtual Account</div>
            <div className={classes.noVa}>{VAnumber?.match(/\d{1,3}/g).join(' ')}</div>
          </div>
          <button
            type="button"
            className={classes.btnCopy}
            onClick={() =>
              copyTextToClipboadrd(
                VAnumber,
                'Virtual Account copied to clipboard!',
                'Virtual Account number is not available.'
              )
            }
            aria-label="button-copy-va"
          >
            <FormattedMessage id="app_response_payment_title_button_copy_va" />
          </button>
        </div>
        <div className={classes.wrapperBtn}>
          <button type="button" aria-label="continue" onClick={() => navigate('/')} className={classes.button}>
            <FormattedMessage id="app_response_payment_button_continue" />
          </button>
        </div>
      </>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  responsePayment: selectResponsePayment,
});
PaymentResponse.propTypes = {
  responsePayment: PropTypes.object,
};

export default connect(mapStateToProps)(PaymentResponse);
