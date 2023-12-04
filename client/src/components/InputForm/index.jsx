import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

const InputForm = ({ name, rules, errorStyle, ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <input {...register(name, rules)} {...rest} />
      {errors[name] && <div className={errorStyle}>{errors[name].message}</div>}
    </>
  );
};

InputForm.propTypes = {
  name: PropTypes.string.isRequired,
  errorStyle: PropTypes.string,
  rules: PropTypes.object,
};

export default InputForm;
