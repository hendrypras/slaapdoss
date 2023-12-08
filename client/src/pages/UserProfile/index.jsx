/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import classNames from 'classnames';
import { PhotoCamera, Edit, Logout, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Container from '@components/Container';
import Button from '@components/Button';
import HeadTitle from '@components/HeadTitle';

import { selectDataIdCard, selectImageCaptured, selectUserData, selectUserProfile } from '@pages/UserProfile/selectors';
import IdCard from '@pages/UserProfile/components/IdCard';
import { getDataCrutialUser, getUserProfile, setImageCaptured, updateUserProfile } from '@pages/UserProfile/actions';
import PopUpCamera from '@pages/UserProfile/components/PopUpCamera';

import { selectLoading } from '@containers/App/selectors';
import { showPopup } from '@containers/App/actions';

import classes from './style.module.scss';

const UserProfile = ({ userProfile, dataIdCard, dataUser, loadingGlobal, imageCaptured }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileSelcted, setFileSelected] = useState(null);

  const [openCamera, setOpenCamera] = useState(false);
  useEffect(() => {
    dispatch(getDataCrutialUser());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      dispatch(setImageCaptured(null));
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setFileSelected(file);
    }
  };

  const handleSubmiChangeImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (imageCaptured) {
      const byteCharacters = atob(imageCaptured.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      formData.append('profile', blob);
    }
    if (fileSelcted) {
      formData.append('profile', fileSelcted);
    }
    formData.append('imagePublicId', userProfile?.image_public_id);

    dispatch(
      updateUserProfile(formData, () => {
        dispatch(getUserProfile());
        dispatch(setImageCaptured(null));
        setFileSelected(null);
      })
    );
  };

  return (
    <>
      <PopUpCamera open={openCamera} onClose={() => setOpenCamera(false)} />
      <Container className={classes.container}>
        <>
          <HeadTitle titleId="app_user_profile_head_title" className={classes.headTitle} />
          <div className={classes.wrapper}>
            <div className={classes.leftWrapper}>
              <div className={classes.username}>{userProfile?.username}</div>
              <div className={classes.wrapperMenu}>
                <button
                  type="button"
                  aria-label="button-history"
                  onClick={() => navigate('/user/history')}
                  className={classes.button}
                >
                  <History />
                  <FormattedMessage id="app_user_profile_text_button_history" />
                </button>
                <button
                  type="button"
                  aria-label="button-logout"
                  onClick={() =>
                    dispatch(showPopup('', '', 'logout', 'app_popup_logout_title', 'app_popup_logout_message'))
                  }
                  className={classes.button}
                >
                  <Logout />
                  <FormattedMessage id="app_logout_text_button" />
                </button>
              </div>
            </div>
            <div className={classes.rightWrapper}>
              <div className={classes.imageWrapper}>
                <div className={classes.wrapperImageContent}>
                  <div className={classes.title}>
                    <FormattedMessage id="app_user_profile_profile_picture_text" />
                  </div>
                  <div className={classes.wrapperImage}>
                    <img
                      src={imageCaptured || selectedImage || userProfile?.image_url}
                      alt="avatar"
                      className={classes.img}
                    />
                    <div className={classes.wrapperBtn}>
                      <label htmlFor="fileInputProfile" className={classes.btnEdit}>
                        <Edit />
                      </label>
                      <input
                        id="fileInputProfile"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleImageChange}
                        className={classes.input}
                      />
                      <button
                        aria-label="button"
                        className={classes.btnEdit}
                        type="button"
                        onClick={() => setOpenCamera(true)}
                      >
                        <PhotoCamera />
                      </button>
                    </div>
                  </div>
                  {imageCaptured || fileSelcted ? (
                    <Button
                      text="app_user_profile_text_button_save_image_profile"
                      type="button"
                      className={classes.btnSaveImage}
                      onClick={handleSubmiChangeImage}
                    />
                  ) : null}
                </div>
                <div className={classes.wrapperImageContent}>
                  <div className={classes.title}>
                    <FormattedMessage id="app_user_profile_id_card_text" />
                  </div>
                  <IdCard dataIdCard={dataIdCard} dataUser={dataUser} loading={loadingGlobal} />
                </div>
              </div>

              <div className={classes.wrapperValue}>
                <div className={classes.box}>
                  <div
                    className={classNames({
                      [classes.value]: true,
                      [classes.verified]: dataUser?.id_card?.name || false,
                    })}
                  >
                    {dataUser?.id_card?.name || userProfile?.username || ''}
                  </div>
                  <div
                    className={classNames({
                      [classes.title]: true,
                      [classes.verified]: dataUser?.id_card?.name || false,
                    })}
                  >
                    Name
                  </div>
                  <VerifiedIcon
                    className={classNames({ [classes.icon]: true, [classes.verified]: dataUser?.id_card || false })}
                  />
                </div>
                <div className={classes.box}>
                  <div
                    className={classNames({
                      [classes.value]: true,
                      [classes.verified]: dataUser?.email || false,
                    })}
                  >
                    {dataUser?.email || ''}
                  </div>
                  <div
                    className={classNames({
                      [classes.title]: true,
                      [classes.verified]: dataUser?.email || false,
                    })}
                  >
                    Email
                  </div>
                  <VerifiedIcon
                    className={classNames({ [classes.icon]: true, [classes.verified]: dataUser?.email || false })}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      </Container>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  userProfile: selectUserProfile,
  dataIdCard: selectDataIdCard,
  dataUser: selectUserData,
  loadingGlobal: selectLoading,
  imageCaptured: selectImageCaptured,
});

UserProfile.propTypes = {
  userProfile: PropTypes.object,
  dataIdCard: PropTypes.object,
  dataUser: PropTypes.object,
  loadingGlobal: PropTypes.bool,
  imageCaptured: PropTypes.string,
};

export default injectIntl(connect(mapStateToProps)(UserProfile));
