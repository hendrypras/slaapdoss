/* eslint-disable no-underscore-dangle */
import { useDispatch, connect } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

import { selectLogin } from '@containers/Client/selectors';
import { showPopup } from '@containers/App/actions';

import { auth } from '@utils/firebase';

import { oAuthGoogle } from '@pages/Login/actions';
import { selectLoading, selectTokenStep } from '@pages/Register/selectors';
import StepThree from '@pages/Register/components/StepThree';
import StepOne from '@pages/Register/components/StepOne';
import StepTwo from '@pages/Register/components/StepTwo';

import WrapperAuthentication from '@components/WrapperAuthentication';

const Register = ({ login, loading, tokenStep }) => {
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

  const handleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firstName = result?._tokenResponse?.firstName;
      const lastName = result?._tokenResponse?.fullName;
      const emailOauth = result?._tokenResponse?.email;
      const imageOauth = result?._tokenResponse?.photoUrl;
      dispatch(
        oAuthGoogle({
          first_name: firstName,
          last_name: lastName,
          email: emailOauth,
          image: imageOauth || null,
        })
      );
    } catch (error) {
      toast.error('Firebase Broken');
      Promise.reject(error);
    }
  };

  switch (step) {
    case 1:
      return (
        <WrapperAuthentication title="app_sign_up_title">
          <StepOne loading={loading} handleAuth={handleAuth} />
        </WrapperAuthentication>
      );
    case 2:
      return (
        <WrapperAuthentication title="app_sign_up_title">
          <StepTwo loading={loading} token={tokenStep} email={email} />
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
  tokenStep: PropTypes.string,
};
const mapStateToProps = createStructuredSelector({
  login: selectLogin,
  loading: selectLoading,
  tokenStep: selectTokenStep,
});
export default connect(mapStateToProps)(Register);
