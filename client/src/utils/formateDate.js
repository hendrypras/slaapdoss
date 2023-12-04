import moment from 'moment';

const formateDate = (date, format = 'hh:ss DD MMMM YYYY') => moment(date).format(format);
export default formateDate;
