/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useMediaQuery } from '@mui/material';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { PhotoCamera, Edit, Logout, History, Close, Verified as VerifiedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Container from '@components/Container';
import Button from '@components/Button';
import HeadTitle from '@components/HeadTitle';

import {
  selectDataIdCard,
  selectImageCaptured,
  selectImageSelected,
  selectUserData,
  selectUserProfile,
} from '@pages/UserProfile/selectors';
import IdCard from '@pages/UserProfile/components/IdCard';
import {
  getDataCrutialUser,
  getUserProfile,
  setImageCaptured,
  setImageSelected,
  updateUserProfile,
  uploadIdCard,
} from '@pages/UserProfile/actions';
import PopUpCamera from '@pages/UserProfile/components/PopUpCamera';

import defaultIdCard from '@static/images/default-id.svg';

import { selectLoading } from '@containers/App/selectors';
import { showPopup } from '@containers/App/actions';

import DrawerMobile from '@components/DrawerMobile';
import ModalPopUp from '@components/ModalPopUp';

import classes from './style.module.scss';

const UserProfile = ({ userProfile, dataIdCard, dataUser, loadingGlobal, imageCaptured, imageSelected }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isTablet = useMediaQuery('(min-width:768px)');

  const [fileSelected, setFileSelected] = useState(null);

  const [open, setOpen] = useState({
    camera: false,
    popUp: false,
    drawer: false,
  });

  const idCardUrl = dataIdCard?.idCardUrl;
  useEffect(() => {
    dispatch(getDataCrutialUser());
  }, [dispatch]);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      dispatch(setImageCaptured(null));
      reader.onload = (event) => {
        if (type === 'profile') {
          dispatch(setImageSelected(imageSelected.idCard, event.target.result));
        } else if (type === 'idCard') {
          dispatch(setImageSelected(event.target.result, imageSelected.profile));
          dispatch(
            uploadIdCard({ idCardUrl: event.target.result }, () => {
              dispatch(setImageSelected(null, imageSelected.profile));
            })
          );
        }
      };
      reader.readAsDataURL(file);
      if (type === 'profile') {
        setFileSelected(file);
      }
    }
  };
  const handleOpen = (openName) => {
    setOpen((prev) => ({ ...prev, [openName]: !prev[openName] }));
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
    if (fileSelected) {
      formData.append('profile', fileSelected);
    }
    formData.append('imagePublicId', userProfile?.image_public_id);

    dispatch(
      updateUserProfile(formData, () => {
        dispatch(getUserProfile());
        dispatch(setImageCaptured(null));
        dispatch(setImageSelected(imageSelected.idCard, null));
        setFileSelected(null);
      })
    );
  };
  const handleRemoveResultImage = (e) => {
    e.preventDefault();
    dispatch(setImageSelected());
    dispatch(setImageSelected(imageSelected.idCard, null));
    setFileSelected(null);
  };

  return (
    <>
      <PopUpCamera open={open.camera} onClose={() => handleOpen('camera')} />
      <Container className={classes.container}>
        <>
          <HeadTitle size={22} className={classes.headTitle}>
            <FormattedMessage id="app_user_profile_head_title" />
          </HeadTitle>
          <div className={classes.wrapper}>
            <div className={classes.leftWrapper}>
              <div className={classes.username}>{userProfile?.username}</div>
              <div className={classes.wrapperMenu}>
                <Button
                  type="button"
                  aria-label="button-history"
                  onClick={() => navigate('/user/orders')}
                  className={classes.button}
                >
                  <>
                    <History />
                    <FormattedMessage id="app_user_profile_text_button_history" />
                  </>
                </Button>
                <Button
                  type="button"
                  aria-label="button-logout"
                  onClick={() =>
                    dispatch(showPopup('', '', 'logout', 'app_popup_logout_title', 'app_popup_logout_message'))
                  }
                  className={classes.button}
                >
                  <>
                    <Logout />
                    <FormattedMessage id="app_logout_text_button" />
                  </>
                </Button>
              </div>
            </div>
            <div className={classes.rightWrapper}>
              <div className={classes.imageWrapper}>
                <div className={classes.wrapperImageContent}>
                  <HeadTitle size={20}>
                    <FormattedMessage id="app_user_profile_profile_picture_text" />
                  </HeadTitle>
                  <div className={classes.wrapperImage}>
                    {(imageCaptured || imageSelected.profile) && (
                      <Button onClick={handleRemoveResultImage} className={classes.btnRemoveImg}>
                        <Close className={classes.icon} />
                      </Button>
                    )}
                    <img
                      src={imageCaptured || imageSelected.profile || userProfile?.image_url}
                      alt="avatar"
                      className={classes.img}
                    />
                    {!imageCaptured && !imageSelected.profile && (
                      <div className={classes.wrapperBtn}>
                        <label htmlFor="fileInputProfile" className={classes.btnEdit}>
                          <Edit />
                        </label>
                        <input
                          id="fileInputProfile"
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          onChange={(e) => handleImageChange(e, 'profile')}
                          className={classes.input}
                        />
                        <Button
                          aria-label="button"
                          className={classes.btnEdit}
                          type="button"
                          onClick={() => handleOpen('camera')}
                        >
                          <PhotoCamera />
                        </Button>
                      </div>
                    )}
                  </div>
                  {(imageCaptured || fileSelected) && (
                    <Button type="button" className={classes.btnSaveImage} onClick={handleSubmiChangeImage}>
                      <FormattedMessage id="app_user_profile_text_button_save_image_profile" />
                    </Button>
                  )}
                </div>
                <div className={classes.wrapperImageContent}>
                  <HeadTitle size={20}>
                    <FormattedMessage id="app_user_profile_id_card_text" />
                  </HeadTitle>
                  <div className={classes.wrapperImage}>
                    <img
                      src={dataUser?.id_card?.id_card_url || idCardUrl || imageSelected.idCard || defaultIdCard}
                      alt="idCard"
                      className={classes.img}
                    />
                    {!imageSelected.idCard && !idCardUrl && !dataUser?.id_card?.id_card_url ? (
                      <div className={classes.wrapperBtn}>
                        <label htmlFor="idCard" className={classes.btnEdit}>
                          <Edit />
                        </label>
                        <input
                          id="idCard"
                          accept=".png, .jpg, .jpeg"
                          type="file"
                          onChange={(e) => handleImageChange(e, 'idCard')}
                          className={classes.input}
                        />
                      </div>
                    ) : null}
                  </div>
                  {(imageSelected.idCard || idCardUrl) && (
                    <Button type="button" onClick={() => handleOpen(isTablet ? 'popUp' : 'drawer')}>
                      <FormattedMessage id="app_user_profile_text_button_save_image_id_card" />
                    </Button>
                  )}
                  {isTablet ? (
                    <ModalPopUp height="max-content" open={open.popUp} onClose={() => handleOpen('popUp')}>
                      <IdCard
                        dataIdCard={dataIdCard}
                        dataUser={dataUser}
                        loading={loadingGlobal}
                        imageSelected={imageSelected}
                        onCloseDrawerPopUp={() => handleOpen('popUp')}
                      />
                    </ModalPopUp>
                  ) : (
                    <DrawerMobile
                      padding="2rem 1rem"
                      height="60vh"
                      open={open.drawer}
                      onClose={() => handleOpen('drawer')}
                    >
                      <IdCard
                        dataIdCard={dataIdCard}
                        dataUser={dataUser}
                        loading={loadingGlobal}
                        imageSelected={imageSelected}
                        onCloseDrawerPopUp={() => handleOpen('drawer')}
                      />
                    </DrawerMobile>
                  )}
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
  imageSelected: selectImageSelected,
});

UserProfile.propTypes = {
  userProfile: PropTypes.object,
  dataIdCard: PropTypes.object,
  dataUser: PropTypes.object,
  imageSelected: PropTypes.object,
  loadingGlobal: PropTypes.bool,
  imageCaptured: PropTypes.string,
};

export default injectIntl(connect(mapStateToProps)(UserProfile));
