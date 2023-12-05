import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import LoaderDots from '@components/Loader';

import { verifyTokenResetPassword } from '@pages/ResetPassword/actions';

const CallBack = () => {
  const { status, data } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (status === 'reset-password' && data) {
      dispatch(
        verifyTokenResetPassword(
          data,
          () => {
            navigate(`/reset-password/${data}`);
          },
          () => {
            navigate(`/notfound`);
          }
        )
      );
    }
  }, [dispatch, navigate, status, data]);
  return <LoaderDots isLoading />;
};

export default CallBack;
