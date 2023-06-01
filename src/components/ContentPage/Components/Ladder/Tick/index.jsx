import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import {
  ValueLadder,
  Ladder1,
  StyledTick,
  WrapperTickContent,
} from './Tick.style';
import { toast } from 'react-toastify';

const Tick = ({
  id,
  hasCursor,
  data,
  tooltip,
  onOrder,
  onCancel,
  totalSize = 0,
  totalBefore = 0,
  totalSizeSecond = 0,
  isShowBackground = false,
  isBackgroundBid = false,
  isConnect,
  onSelectPrice,
  valuePrice,
}) => {
  const { value, orderIds, isBid, price } = { ...data };
  const PADDING = 100000;

  const returnPercentStandard = (total, totalSecond) => {
    if (!isShowBackground) return;
    if (total <= totalSecond) {
      return Math.round((total / totalSecond) * 100);
    } else {
      return 100;
    }
  };

  const handleClick = (e) => {
    e.preventDefault;
    onSelectPrice(valuePrice);
    if (
      !isConnect &&
      (typeof onOrder === 'function' || typeof onCancel === 'function')
    ) {
      toast.warn('Connect wallet to make transactions.');
      return;
    }
    if (typeof onOrder === 'function') {
      onOrder({ isBid, price });
    } else if (typeof onCancel === 'function') {
      onCancel({ orderIds });
    }
  };

  const returnTotalSizeAsk = () => {
    const totalPercentStandard = returnPercentStandard(
      totalSize,
      totalSizeSecond
    );

    if (totalBefore === totalSize) {
      return `${totalPercentStandard}%`;
    }

    const lastPercent =
      (totalBefore / totalSize) * totalPercentStandard > 0 &&
      (totalBefore / totalSize) * totalPercentStandard < 1
        ? 1
        : Math.round((totalBefore / totalSize) * totalPercentStandard);
    return `${lastPercent}%`;
  };

  const returnTotalSizeChildrenAsk = () => {
    const totalPercentStandard = returnPercentStandard(
      totalSize,
      totalSizeSecond
    );
    const newValue = value * 1 * PADDING;
    if (totalBefore === 0) {
      return `0%`;
    }
    const lastPercent =
      (newValue / totalSize) * totalPercentStandard > 0 &&
      (newValue / totalSize) * totalPercentStandard < 1
        ? 1
        : Math.round((newValue / totalSize) * totalPercentStandard);
    return `${lastPercent}%`;
  };

  const returnTotalSizeBid = () => {
    const totalPercentStandard = returnPercentStandard(
      totalSize,
      totalSizeSecond
    );

    if (totalBefore === totalSize) {
      return `0%`;
    }
    const lastPercent =
      (totalBefore / totalSize) * totalPercentStandard > 99 &&
      (totalBefore / totalSize) * totalPercentStandard < 100
        ? 99
        : Math.round((totalBefore / totalSize) * totalPercentStandard);
    return `${totalPercentStandard - lastPercent}%`;
  };

  const returnTotalSizeChildrenBid = () => {
    const totalPercentStandard = returnPercentStandard(
      totalSize,
      totalSizeSecond
    );
    const newValue = value * 1 * PADDING;
    if (totalBefore === totalSize) {
      return `0%`;
    }
    const lastPercent =
      (newValue / totalSize) * totalPercentStandard > 0 &&
      (newValue / totalSize) * totalPercentStandard < 1
        ? 1
        : Math.round((newValue / totalSize) * totalPercentStandard);
    return `${lastPercent}%`;
  };

  return (
    <>
      <StyledTick id={id}>
        <WrapperTickContent hasCursor={hasCursor} onClick={handleClick}>
          <span>
            {value === 0 || value === '0' || !value
              ? ''
              : isShowBackground
              ? `${value}`.substring(0, 8) * 1
              : value}
          </span>
          {hasCursor && id !== undefined && (
            <Tooltip
              anchorSelect={`#${id}`}
              content={tooltip}
              offset={-12}
              className="tooltip"
            />
          )}
        </WrapperTickContent>
        {isShowBackground && !isBackgroundBid && (
          <>
            <Ladder1 width={returnTotalSizeAsk()}></Ladder1>
            <ValueLadder width={returnTotalSizeChildrenAsk()}></ValueLadder>
          </>
        )}
        {isShowBackground && isBackgroundBid && (
          <>
            <Ladder1
              bid={isBackgroundBid}
              width={returnTotalSizeBid()}
            ></Ladder1>
            <ValueLadder
              bid={isBackgroundBid}
              width={returnTotalSizeChildrenBid()}
            ></ValueLadder>
          </>
        )}
      </StyledTick>
    </>
  );
};

export default Tick;
