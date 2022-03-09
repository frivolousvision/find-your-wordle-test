import React, { useState, useEffect } from "react";

const LettersToInclude = (props) => {
  const [selected, setSelected] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [greenLetter, setGreenLetter] = useState(false);

  useEffect(() => {
    if (props.haveGreen) {
      setSelected(false);
    }
    for (let i = 0; i < props.word.length; i++) {
      if (props.word[i].toLowerCase() === props.letter.toLowerCase()) {
        setSelected(true);
        setGreenLetter(true);
      }
    }
    for (let i = 0; i < props.existentLetters.length; i++) {
      if (
        props.existentLetters[i].toLowerCase() === props.letter.toLowerCase()
      ) {
        setSelected(true);
      }
    }
    // if (props.nonexistentLetters) {
    //   for (let i = 0; i < props.nonexistentLetters.length; i++) {
    //     if (
    //       props.nonexistentLetters[i].toLowerCase() ===
    //       props.letter.toLowerCase()
    //     ) {
    //       setDisabled(true);
    //     }
    //   }
    // }
    if (props.nonexistentLetters.includes(props.letter)) {
      setDisabled(true);
    } else {
      setDisabled(false);
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
      props.deselectIncludedLetter(letter);
    } else {
      setSelected(true);
      props.selectIncludedLetter(letter);
    }
  };
  return (
    <div>
      {props.possibleWords.length > 0 ? (
        <div
          className={`container ${
            selected ? "existent-selected" : "existent-not-selected"
          } ${disabled ? "disabled" : null}
            ${greenLetter ? "green-letter" : null}
          `}
          onClick={!disabled ? () => handleLetterClick(props.letter) : null}
        >
          <p>{props.letter}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LettersToInclude;
