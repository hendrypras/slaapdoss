import moment from 'moment';

export const getGreeting = () => {
  const currentTime = new Date().getHours();

  if (currentTime >= 5 && currentTime < 12) {
    return 'Good morning';
  }
  if (currentTime >= 12 && currentTime < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
};
// Function untuk mendapatkan tanggal hari ini
export const getCheckIn = (date) => {
  const value = moment().format('YYYY-MM-DD');
  const unix = moment(`${date || value} 14:00:00`).valueOf();
  const display = moment().format('ddd, D MMMM YYYY');
  return { value, unix, display };
};

// Function untuk mendapatkan tanggal besok
export const getCheckOut = (date) => {
  const value = moment().add(1, 'day').format('YYYY-MM-DD');
  const unix = moment(`${date || value} 12:00:00`).valueOf();
  const display = moment().add(1, 'days').format('ddd, D MMMM YYYY');
  return { display, value, unix };
};
export const calculateDurationInDays = (start, end) => {
  const startMoment = moment(start).startOf('day');
  const endMoment = moment(end).startOf('day');
  const duration = moment.duration(endMoment.diff(startMoment));
  return duration.asDays();
};
