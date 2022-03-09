import React, { useState, useEffect } from "react";

const LettersToExclude = (props) => {
  const [selected, setSelected] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (props.existentLetters.includes(props.letter)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    for (let i = 0; i < props.word.length; i++) {
      if (props.word[i].toLowerCase() === props.letter.toLowerCase()) {
        setDisabled(true);
      }
    }
  }, [
    props.haveGreen,
    props.searched,
    props.possibleWords,
    props.word,
    props.nonexistentLetters,
    props.existentLetters,
    props.letter,
  ]);

  const handleLetterClick = (letter) => {
    if (selected) {
      setSelected(false);
      props.deselectExcludedLetter(letter);
    } else {
      setSelected(true);
      props.selectExcludedLetter(letter);
    }
  };
  return (
    <div>
      {props.possibleWords.length > 0 ? (
        <div
          className={`container ${
            selected ? "nonexistent-selected" : "nonexistent-not-selected"
          } ${disabled ? "disabled" : null}`}
          onClick={!disabled ? () => handleLetterClick(props.letter) : null}
        >
          <p>{props.letter}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LettersToExclude;
