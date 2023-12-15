import moment from 'moment';

const formateDate = (date, format = 'hh:ss DD MMMM YYYY') =>
  date ? moment(date).format(format) : moment().format(format);
export default formateDate;
