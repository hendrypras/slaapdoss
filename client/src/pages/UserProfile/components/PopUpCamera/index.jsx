import { useState } from 'react';
import Webcam from 'react-webcam';
import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';

import { setImageCaptured } from '@pages/UserProfile/actions';

import Button from '@components/Button';
import classes from './style.module.scss';

const PopUpCamera = ({ open, onClose }) => {
  const [webcamRef, setWebcamRef] = useState(null);
  const dispatch = useDispatch();

  const captureImage = () => {
    if (webcamRef) {
      const imageSrc = webcamRef.getScreenshot();
      dispatch(setImageCaptured(imageSrc));
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.dialogWrapper }}>
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        mirrored
        ref={(cam) => {
          setWebcamRef(cam);
        }}
      />
      <div className={classes.wrapperBtn}>
        <Button
          className={classes.btn}
          text="app_user_profile_text_button_close_camera"
          type="button"
          onClick={onClose}
        />
        <Button
          className={classes.btn}
          text="app_user_profile_text_button_captured"
          type="button"
          onClick={captureImage}
        />
      </div>
    </Dialog>
  );
};

PopUpCamera.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
export default PopUpCamera;
