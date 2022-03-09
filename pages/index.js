import React, { useState, useRef } from "react";
import Head from "next/head";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";
import LettersToExclude from "../src/components/Letter/LettersToExclude";
import LettersToInclude from "../src/components/Letter/LettersToInclude";
import OnlyYellowsLettersToInclude from "../src/components/Letter/OnlyYellowsLettersToInclude";

export default function Home() {
  const [searched, setSearched] = useState(false);
  const [firstLetter, setFirstLetter] = useState("");
  const [secondLetter, setSecondLetter] = useState("");
  const [thirdLetter, setThirdLetter] = useState("");
  const [fourthLetter, setFourthLetter] = useState("");
  const [fifthLetter, setFifthLetter] = useState("");
  const [possibleWords, setPossibleWords] = useState([]);
  const [nonexistentLetters] = useState([]);
  const [existentLetters, setExistentLetters] = useState([]);
  const [onlyYellows, setOnlyYellows] = useState(false);
  const [haveGreen, setHaveGreen] = useState(false);
  const [allLetters] = useState([
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ]);
  const [word] = useState(["?", "?", "?", "?", "?"]);
  const myRef = useRef(null);

  const handleScroll = () => {
    myRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    searchWord();
    setTimeout(() => {
      handleScroll();
    }, 500);
  };
  const handleFocus = (e) => {
    if (e.target.value.length > 0 && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };
  const handleBackspace = (e) => {
    if (
      e.keyCode === 8 &&
      e.target.previousSibling &&
      !e.target.nextSibling &&
      e.target.value === ""
    ) {
      setFifthLetter("");
    }
    if (e.keyCode === 8 && e.target.previousSibling && e.target.value === "") {
      e.target.previousSibling.focus();
    }
  };

  const searchWord = async () => {
    if (searched) {
      setHaveGreen(true);
    }
    if (firstLetter.length > 0 && typeof firstLetter === "string") {
      word.splice(0, 1, firstLetter);
    } else {
      word.splice(0, 1, "?");
    }
    if (secondLetter.length > 0 && typeof secondLetter === "string") {
      word.splice(1, 1, secondLetter);
    } else {
      word.splice(1, 1, "?");
    }
    if (thirdLetter.length > 0 && typeof thirdLetter === "string") {
      word.splice(2, 1, thirdLetter);
    } else {
      word.splice(2, 1, "?");
    }
    if (fourthLetter.length > 0 && typeof fourthLetter === "string") {
      word.splice(3, 1, fourthLetter);
    } else {
      word.splice(3, 1, "?");
    }
    if (fifthLetter.length > 0 && typeof fifthLetter === "string") {
      word.splice(4, 1, fifthLetter);
    } else {
      word.splice(4, 1, "?");
    }
    let wordToSearch = word.join("");
    if (existentLetters.length === 0 && nonexistentLetters.length === 0) {
      try {
        const result = await fetch(
          `https://api.datamuse.com/words?sp=${wordToSearch}`
        );
        const jsonResult = await result.json();
        setPossibleWords(jsonResult);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      if (existentLetters.length === 1 && nonexistentLetters.length === 0) {
        try {
          const result = await fetch(
            `https://api.datamuse.com/words?sp=${wordToSearch},*${existentLetters
              .join("")
              .toLowerCase()}*
              `
          );
          const jsonResult = await result.json();
          setPossibleWords(jsonResult);
        } catch (error) {
          console.log(error.message);
        }
      } else if (
        existentLetters.length === 1 &&
        nonexistentLetters.length > 0
      ) {
        try {
          const result = await fetch(
            `https://api.datamuse.com/words?sp=${wordToSearch},*${existentLetters
              .join("")
              .toLowerCase()}*-${nonexistentLetters.join("").toLowerCase()}
                `
          );
          const jsonResult = await result.json();
          setPossibleWords(jsonResult);
        } catch (error) {
          console.log(error.message);
        }
      } else if (
        existentLetters.length === 0 &&
        nonexistentLetters.length > 0
      ) {
        try {
          const result = await fetch(
            `https://api.datamuse.com/words?sp=${wordToSearch}-${nonexistentLetters
              .join("")
              .toLowerCase()}
                `
          );
          const jsonResult = await result.json();
          setPossibleWords(jsonResult);
        } catch (error) {
          console.log(error.message);
        }
      } else if (
        existentLetters.length > 1 &&
        nonexistentLetters.length === 0
      ) {
        let existentLetterString = formatExistentLetterString(existentLetters);
        try {
          const result = await fetch(
            `https://api.datamuse.com/words?sp=${wordToSearch}${existentLetterString}
                `
          );
          const jsonResult = await result.json();
          setPossibleWords(jsonResult);
        } catch (error) {
          console.log(error.message);
        }
      } else if (existentLetters.length > 1 && nonexistentLetters.length > 0) {
        let existentLetterString = formatExistentLetterString(existentLetters);
        try {
          const result = await fetch(
            `https://api.datamuse.com/words?sp=${wordToSearch}${existentLetterString}-${nonexistentLetters
              .join("")
              .toLowerCase()}
                `
          );
          const jsonResult = await result.json();
          setPossibleWords(jsonResult);
        } catch (error) {
          console.log(error.message);
        }
      }
    }
    setSearched(true);
  };

  const formatExistentLetterString = (arr) => {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
      newArray.push(arr[i].concat("*"));
    }
    return ",*" + newArray.join(`,*`).toLowerCase();
  };

  const filterExistentLetters = () => {
    for (let i = 0; i < existentLetters.length; i++) {
      setPossibleWords(
        possibleWords.filter((word) =>
          word.word.toLowerCase().includes(existentLetters[i].toLowerCase())
        )
      );
    }
  };

  const selectExcludedLetter = (letter) => {
    nonexistentLetters.push(letter);
    searchWord();
  };

  const deselectExcludedLetter = (letter) => {
    let index = nonexistentLetters.findIndex((x) => x === letter);
    nonexistentLetters.splice(index, 1);
    if (possibleWords.length > 0) {
      searchWord();
    }
  };

  const selectIncludedLetter = (letter) => {
    existentLetters.push(letter);
    searchWord();
  };

  const deselectIncludedLetter = (letter) => {
    setExistentLetters(existentLetters.filter((x) => x !== letter));
    if (possibleWords.length > 0) {
      searchWord();
    }
  };

  const selectOnlyYellowLetter = (letter) => {
    existentLetters.push(letter);
    if (possibleWords.length > 0) {
      filterExistentLetters();
    }
  };

  const deselectOnlyYellowLetter = (letter) => {
    setExistentLetters(existentLetters.filter((x) => x !== letter));
    if (possibleWords.length > 0) {
      searchWord();
    }
  };

  const handleYellowGreenToggle = () => {
    if (!onlyYellows) {
      setOnlyYellows(true);
      setHaveGreen(false);
      setPossibleWords([]);
    } else {
      setSearched(false);
      setOnlyYellows(false);
      setHaveGreen(true);
      setPossibleWords([]);
    }
  };
  return (
    <>
      <Head>
        <title>Find your Worldle</title>
        <meta
          name='description'
          content='Having trouble with your Wordle? Use Find your Wordle to help you solve and find your Wordle!'
        />
        <meta name='keywords' content='' />
        <meta itemProp='name' content='Find your Worldle' />
        <meta
          itemProp='description'
          content='Having trouble with your Wordle? Use Find your Wordle to help you solve and find your Wordle!'
        />
        <meta
          itemProp='image'
          content='https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wordle_196_example.svg/220px-Wordle_196_example.svg.png'
        />

        <meta property='og:url' content='https://www.findyourwordle.com' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Find your Worldle' />
        <meta
          property='og:description'
          content='Having trouble with your Wordle? Use Find your Wordle to help you solve and find your Wordle!'
        />
        <meta
          property='og:image'
          content='https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wordle_196_example.svg/220px-Wordle_196_example.svg.png'
        />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Find your Worldle' />
        <meta
          name='twitter:description'
          content='Having trouble with your Wordle? Use Find your Wordle to help you solve and find your Wordle!'
        />
        <meta
          name='twitter:image'
          content='https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Wordle_196_example.svg/220px-Wordle_196_example.svg.png'
        />
      </Head>
      <div className='App'>
        <h1 className={`header ${searched ? "searched" : "not-searched"}`}>
          Find Your Wordle
        </h1>
        {onlyYellows && possibleWords.length === 0 ? (
          <div className='only-yellows-container'>
            <p>Select your yellow letters:</p>
            <div className='existent-letter-list'>
              {allLetters.map((letter, index) => (
                <OnlyYellowsLettersToInclude
                  letter={letter}
                  key={index}
                  selectOnlyYellowLetter={selectOnlyYellowLetter}
                  deselectOnlyYellowLetter={deselectOnlyYellowLetter}
                  possibleWords={possibleWords}
                />
              ))}
            </div>
          </div>
        ) : null}
        {!onlyYellows ? <p>Enter your green letters here:</p> : null}
        <form onSubmit={(e) => handleSubmit(e)}>
          {!onlyYellows ? (
            <div className='input-field'>
              <input
                type='text'
                maxLength={1}
                placeholder=''
                value={firstLetter.toUpperCase()}
                onFocus={() => setFirstLetter("")}
                onChange={(e) => {
                  setFirstLetter(e.target.value);
                  handleFocus(e);
                }}
                onKeyDown={(e) => handleBackspace(e)}
                className={`${
                  firstLetter !== "?" && firstLetter.length > 0
                    ? "input-entered"
                    : "input-blank"
                }`}
              ></input>
              <input
                type='text'
                maxLength={1}
                placeholder=''
                value={secondLetter.toUpperCase()}
                onFocus={() => setSecondLetter("")}
                onChange={(e) => {
                  setSecondLetter(e.target.value);
                  handleFocus(e);
                }}
                onKeyDown={(e) => handleBackspace(e)}
                className={`${
                  secondLetter !== "?" && secondLetter.length > 0
                    ? "input-entered"
                    : "input-blank"
                }`}
              ></input>
              <input
                type='text'
                maxLength={1}
                placeholder=''
                value={thirdLetter.toUpperCase()}
                onFocus={() => setThirdLetter("")}
                onChange={(e) => {
                  setThirdLetter(e.target.value);
                  handleFocus(e);
                }}
                onKeyDown={(e) => handleBackspace(e)}
                className={`${
                  thirdLetter !== "?" && thirdLetter.length > 0
                    ? "input-entered"
                    : "input-blank"
                }`}
              ></input>
              <input
                type='text'
                maxLength={1}
                placeholder=''
                value={fourthLetter.toUpperCase()}
                onFocus={() => setFourthLetter("")}
                onChange={(e) => {
                  setFourthLetter(e.target.value);
                  handleFocus(e);
                }}
                onKeyDown={(e) => handleBackspace(e)}
                className={`${
                  fourthLetter !== "?" && fourthLetter.length > 0
                    ? "input-entered"
                    : "input-blank"
                }`}
              ></input>
              <input
                type='text'
                maxLength={1}
                placeholder=''
                value={fifthLetter.toUpperCase()}
                onFocus={() => setFifthLetter("")}
                onChange={(e) => {
                  setFifthLetter(e.target.value);
                  handleFocus(e);
                }}
                onKeyDown={(e) => handleBackspace(e)}
                className={`${
                  fifthLetter !== "?" && fifthLetter.length > 0
                    ? "input-entered"
                    : "input-blank"
                }`}
              ></input>
            </div>
          ) : null}
          <button className='search-button'>Search</button>
          <div ref={myRef}></div>
          {possibleWords.length > 0 && searched ? (
            <p>Refresh page for an entirely new search!</p>
          ) : null}
        </form>

        {!onlyYellows && !searched ? (
          <p
            onClick={() => handleYellowGreenToggle()}
            className='toggle-yellow-green-button only-yellows'
          >
            I only have yellow letters
          </p>
        ) : null}
        {onlyYellows ? (
          <p
            onClick={() => handleYellowGreenToggle()}
            className='toggle-yellow-green-button have-greens'
          >
            I have green letters now
          </p>
        ) : null}
        {possibleWords.length > 0 ? (
          <h3>Select letters you know aren&apos;t in the word:</h3>
        ) : null}
        <div className='nonexistent-letter-list'>
          {allLetters.map((letter, index) => (
            <LettersToExclude
              letter={letter}
              key={index}
              selectExcludedLetter={selectExcludedLetter}
              deselectExcludedLetter={deselectExcludedLetter}
              possibleWords={possibleWords}
              haveGreen={haveGreen}
              existentLetters={existentLetters}
              nonexistentLetters={nonexistentLetters}
              searched={searched}
              word={word}
            />
          ))}
        </div>
        {possibleWords.length > 0 ? (
          <h3>Select letters you know are in the word:</h3>
        ) : null}
        <div className='existent-letter-list'>
          {allLetters.map((letter, index) => (
            <LettersToInclude
              letter={letter}
              key={index}
              selectIncludedLetter={selectIncludedLetter}
              deselectIncludedLetter={deselectIncludedLetter}
              possibleWords={possibleWords}
              haveGreen={haveGreen}
              existentLetters={existentLetters}
              nonexistentLetters={nonexistentLetters}
              searched={searched}
              word={word}
            />
          ))}
        </div>
        {possibleWords.length > 0 ? <h2>Possible Wordles:</h2> : null}
        <div className='word-list'>
          {possibleWords
            ? possibleWords.map((word, index) => (
                <div key={index} className='each-word'>
                  <p>{word.word.toUpperCase()}</p>
                </div>
              ))
            : null}
        </div>
        {searched && possibleWords.length === 0 ? (
          <h3>
            Looks like there are no words matching that criteria. Refresh page
            for a new search!
          </h3>
        ) : null}
        <p className={`footer-note ${searched ? null : "footer-fixed"}`}>
          created by{" "}
          <a
            href='https://github.com/frivolousvision'
            target='_blank'
            rel='noopener noreferrer'
            className='git-hub-link'
          >
            FrivolousVision
          </a>
        </p>
      </div>
    </>
  );
}
