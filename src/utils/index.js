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

export const handleSort = (data, id, type, isSortTime, isSortNumber) => {
  if (`${type}` === 'true') {
    return data.sort((a, b) => {
      let itemA = a[id];
      let itemB = b[id];
      if (isSortTime) {
        itemA = new Date(a[id]).getTime();
        itemB = new Date(b[id]).getTime();
      }

      if (isSortNumber) {
        itemA = `${a[id]}`.replace(',', '') * 1;
        itemB = `${b[id]}`.replace(',', '') * 1;
      }

      if (itemA > itemB) {
        return -1;
      }
      if (itemA === itemB) {
        return 0;
      }
      return 1;
    });
  }
  if (`${type}` === 'false') {
    return data.sort((a, b) => {
      let itemA = a[id];
      let itemB = b[id];
      if (isSortTime) {
        itemA = new Date(a[id]).getTime();
        itemB = new Date(b[id]).getTime();
      }
      if (isSortNumber) {
        itemA = `${a[id]}`.replace(',', '') * 1;
        itemB = `${b[id]}`.replace(',', '') * 1;
      }
      if (itemA > itemB) {
        return 1;
      }
      if (itemA === itemB) {
        return 0;
      }
      return -1;
    });
  }
};
