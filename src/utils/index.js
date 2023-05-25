import moment from 'moment';

export const handleConvertTime = (time) => {
  if (!time) {
    return '-';
  }
  const momentObj = moment(time);
  const utcMomentObj = moment.utc(momentObj);
  return utcMomentObj.format('YYYY-MM-DD HH:mm:ss');
};

export const shortPkStr = (pk) => {
  // const pkstr = pk.toBase58();
  return pk.slice(0, 4) + '...' + pk.slice(-4);
};
