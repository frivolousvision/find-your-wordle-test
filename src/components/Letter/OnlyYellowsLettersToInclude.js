import React, { useState } from "react";

const OnlyYellowsLettersToInclude = (props) => {
  const [selected, setSelected] = useState(false);

  const handleLetterClick = (letter) => {
    if (selected) {
      setSelected(false);
      props.deselectOnlyYellowLetter(letter);
    } else {
      setSelected(true);
      props.selectOnlyYellowLetter(letter);
    }
  };
  return (
    <div>
      <div
        className={`container ${
          selected ? "existent-selected" : "existent-not-selected"
        }`}
        onClick={() => handleLetterClick(props.letter)}
      >
        <p>{props.letter}</p>
      </div>
    </div>
  );
};

export default OnlyYellowsLettersToInclude;
