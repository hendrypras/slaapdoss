import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import classes from './style.module.scss';

const InputFormBasic = ({ name, classInput, classTitle, classWrapper, title, rules, children, ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={classNames(classes.wrapperInput, classWrapper)}>
      {title && (
        <div className={classNames(classes.title, classTitle)}>
          <FormattedMessage id={title} />
        </div>
      )}
      <input className={classNames(classes.input, classInput)} {...register(name, rules)} {...rest} />
      {errors[name] && <div className={classes.errorInput}>{errors[name].message}</div>}
      {children}
    </div>
  );
};

InputFormBasic.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  classWrapper: PropTypes.string,
  classTitle: PropTypes.string,
  classInput: PropTypes.string,
  rules: PropTypes.object,
  children: PropTypes.element,
};

export default InputFormBasic;
