import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const TextWithTooltip = ({ text, maxChars }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  // Kiểm tra nếu văn bản dài hơn giới hạn ký tự cho phép
  const isOverflow = text.length > maxChars;
  const displayText = isOverflow ? `${text.substring(0, maxChars)}...` : text;

  return (
    <div>
      <span id="TextTooltip" style={{ cursor: isOverflow ? 'pointer' : 'default' }}>
        {displayText}
      </span>
      
      {isOverflow && (
        <Tooltip
          placement="top"
          isOpen={tooltipOpen}
          target="TextTooltip"
          toggle={toggleTooltip}
        >
          {text}
        </Tooltip>
      )}
    </div>
  );
};

export default TextWithTooltip;
