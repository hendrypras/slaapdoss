/* eslint-disable no-underscore-dangle */
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import { selectLogin } from '@containers/Client/selectors';
import { showPopup } from '@containers/App/actions';
import { selectLoading as selectLoadingOauth } from '@containers/App/selectors';
import { oAuthGoogle } from '@containers/Client/actions';

import StepThree from '@pages/Register/components/StepThree';
import StepOne from '@pages/Register/components/StepOne';
import StepTwo from '@pages/Register/components/StepTwo';
import { setExpOtp, setTokenStep } from '@pages/Register/actions';
import { selectExpOtp, selectLoading, selectTokenStep } from '@pages/Register/selectors';

import WrapperAuthentication from '@components/WrapperAuthentication';

const Register = ({ login, loading, tokenStep, loadingOauth, otpExp }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (tokenStep) {
      try {
        const decodedToken = jwtDecode(tokenStep);
        setEmail(decodedToken?.email);
        setStep(decodedToken?.step || 1);
      } catch (error) {
        dispatch(showPopup('Token invalid'));
      }
    } else {
      setStep(1);
    }
  }, [tokenStep, dispatch]);

  useEffect(() => {
    if (login) {
      navigate('/');
    }
  }, [login, navigate]);

  const handleBtnBack = () => {
    setStep(1);
    dispatch(setTokenStep(null));
    dispatch(setExpOtp(null));
  };

  switch (step) {
    case 1:
      return (
        <WrapperAuthentication title="app_sign_up_title">
          <StepOne loading={loading} handleAuth={() => dispatch(oAuthGoogle())} loadingOauth={loadingOauth} />
        </WrapperAuthentication>
      );
    case 2:
      return (
        <WrapperAuthentication title="app_sign_up_title">
          <StepTwo loading={loading} token={tokenStep} email={email} otpExp={otpExp} handleBack={handleBtnBack} />
        </WrapperAuthentication>
      );
    case 3:
      return (
        <WrapperAuthentication title="app_sign_up_title">
          <StepThree loading={loading} email={email} token={tokenStep} />
        </WrapperAuthentication>
      );

    default:
      return (
        <WrapperAuthentication title="app_sign_up_title">
          <StepOne loading={loading} />
        </WrapperAuthentication>
      );
  }
};

Register.propTypes = {
  login: PropTypes.bool,
  loading: PropTypes.bool,
  loadingOauth: PropTypes.bool,
  tokenStep: PropTypes.string,
  otpExp: PropTypes.number,
};
const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  loading: selectLoading,
  loadingOauth: selectLoadingOauth,
  tokenStep: selectTokenStep,
  otpExp: selectExpOtp,
});
export default connect(mapStateToProps)(Register);
