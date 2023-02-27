const express = require('express');

//Main exported async function with req, res uses helper functions below
async function searchWords(queryData, callback) {
  console.log(queryData);
  let phrase = queryData.phrase;
  let word = queryData.word;
  let completeWord = queryData.completeWord; //boolean in string format
  let caseSensitive = queryData.caseSensitive; //boolean in string format
  //can change quantifying requirements here or in App.jsx
  var results = await countWords(phrase, word, completeWord, caseSensitive);

  return callback(null, results);
};


async function countWords(phrase, word, completeWord, caseSensitive) {
  var count = 0;
  if (phrase.length > 0 && word.length > 0) {
    //completeword = false options use split() to separate the string by any segment uses
    if (completeWord === 'false' && caseSensitive === 'false') {
      if (phrase.toLowerCase().includes(word.toLowerCase())) {
        var splitPhrase = phrase.toLowerCase().split(word.toLowerCase());
        count += splitPhrase.length - 1;
        return count;
      } else {
        return 0;
      }
    } else if (completeWord === 'false' && caseSensitive === 'true') {
      if (phrase.includes(word)) {
        var splitPhrase = phrase.split(word);
        count = splitPhrase.length - 1;
        return count;
      } else {
        return 0;
      }
      //completeword = true has to run word and phrase through wholeWord helper function
    } else if (completeWord === 'true' && caseSensitive === 'true') {
      if (phrase.includes(word)) {
        count = await wholeWord(createBeginAndEndIndexes(phrase, word), phrase);
        return count;
      } else {
        return 0;
      }
    } else if (completeWord === 'true' && caseSensitive === 'false') {
      if (phrase.toLowerCase().includes(word.toLowerCase())) {
        count = await wholeWord(createBeginAndEndIndexes(phrase.toLowerCase(), word.toLowerCase()), phrase);
        return count;
      } else {
        return 0;
      }
    }
  }
};

//creates beginning and end indices of instances of whole words appearing in the phrase
const createBeginAndEndIndexes = (phrase, word) => {
  var index = 0;
  var pairIndexes = [];
  while (index !== -1) {
    index = phrase.indexOf(word, index);
    if (index !== -1) {
      if (index === 0) {
        pairIndexes.push(0);
      } else {
        pairIndexes.push(index - 1);
      }
      pairIndexes.push(index + word.length);
      index++;
    }
  }
  return pairIndexes;
};

/*compares the beginning and ends of words and the characters or spaces preceding and following them to lists of allowable punctuation and spaces or the very beginning or ending of the phrase*/
const wholeWord = (arrayOfIndexes, phrase) => {
  var count = 0;
  var open = " [{(\"\'</.@";
  var close = " ]})\"\'>/!?:;,.@";
  var begin = false;
  var end = false;
  //if the first index compared is the firsst index in the phrase, it's allowable
  if (arrayOfIndexes[0] === 0) {
    begin = true;
  }
  for (var j = 0; j < phrase.length; j += 2) {
    if (open.includes(phrase[arrayOfIndexes[j]]) || begin === true) {
      begin = true;
    }
    if (close.includes(phrase[arrayOfIndexes[j + 1]]) || arrayOfIndexes[j + 1] === phrase.length) {
      end = true;
    }
    if (begin && end) {
      count++;
    }
    // resets for the next iteration
    begin = false;
    end = false;
  }
  return count;
};

module.exports = {
  searchWords
}