/**
 * EditorUtils contains helper
 * functions for our Editor
 */

export const displayTextWithMentions = (inputText, formatMentionNode, isTag) => {
  /**
   * Use this function to parse mentions markup @[name](id) in the string value.
   */
  if (inputText === "") return null;
  const retLines = inputText.split("\n");
  const formattedText = [];
  retLines.forEach((retLine, rowIndex) => {
    const mentions = EU.findMentions(retLine);
    if (mentions.length) {
      let lastIndex = 0;
      mentions.forEach((men, index) => {
        const initialStr = retLine.substring(lastIndex, men.start);
        lastIndex = men.end + 1;
        formattedText.push(initialStr);
        const formattedMention = formatMentionNode(
          `${men.name}`,
        );
        formattedText.push(formattedMention);
        if (mentions.length - 1 === index) {
          const lastStr = retLine.substr(lastIndex); //remaining string
          formattedText.push(lastStr);
        }
      });
    } else {
      formattedText.push(retLine);
    }
    formattedText.push("\n");
  });
  return formattedText;
};

export const EU = {
  specialTagsEnum: {
    mention: "mention",
    strong: "strong",
    italic: "italic",
    underline: "underline",
  },
  isKeysAreSame: (src, dest) => src.toString() === dest.toString(),
  getLastItemInMap: map => Array.from(map)[map.size - 1],
  getLastKeyInMap: map => Array.from(map.keys())[map.size - 1],
  getLastValueInMap: map => Array.from(map.values())[map.size - 1],
  updateRemainingMentionsIndexes: (map, { start, end }, diff, shouldAdd) => {
    var newMap = new Map(map);
    const keys = EU.getSelectedMentionKeys(newMap, { start, end });
    keys.forEach(key => {
      const newKey = shouldAdd
        ? [key[0] + diff, key[1] + diff]
        : [key[0] - diff, key[1] - diff];
      const value = newMap.get(key);
      newMap.delete(key);
      //ToDo+ push them in the same order.
      newMap.set(newKey, value);
    });
    return newMap;
  },
  getSelectedMentionKeys: (map, { start, end }) => {
    // mention [2, 5],
    // selection [3, 6]
    const mantionKeys = [...map.keys()];
    const keys = mantionKeys.filter(
      ([a, b]) => EU.between(a, start, end) || EU.between(b, start, end),
    );
    return keys;
  },
  findMentionKeyInMap: (map, cursorIndex) => {
    // const keys = Array.from(map.keys())
    // OR
    const keys = [...map.keys()];
    const key = keys.filter(([a, b]) => EU.between(cursorIndex, a, b))[0];
    return key;
  },
  addMenInSelection: (selection, prevSelc, mentions) => {
    /**
     * Both Mentions and Selections are 0-th index based in the strings.
     * While user made a selection automatically add / remove mention in the selection.
     */
    const sel = { ...selection };
    mentions.forEach((value, [menStart, menEnd]) => {
      if (EU.diff(prevSelc.start, prevSelc.end) < EU.diff(sel.start, sel.end)) {
        // User is selecting more.
        if (EU.between(sel.start, menStart, menEnd)) {
          // Start of selection has increased and is now IN a mention range.
          sel.start = menStart; // Move start of selection to mention start (selects mention).
        }
        if (EU.between(sel.end - 1, menStart, menEnd)) {
          // End of selection has increased and is now IN a mention range.
          sel.end = menEnd + 1; // Move end of selection to mention end (selects mention).
        }
      } else {
        // User is selecting less.
        if (EU.between(sel.start - 1, menStart, menEnd)) {
          // Start of selection has reduced and is now IN a mention range.
          sel.start = menEnd + 1; // Move start selection to mention end (deselects mention).
        }
        if (EU.between(sel.end, menStart, menEnd)) {
          // End of selection has reduced and is now IN a mention range.
          sel.end = menStart; // Move end selection to mention start (deselects mention).
        }
      }
    });

    return sel;
  },
  moveCursorToMentionBoundry: (
    selection,
    prevSelc,
    mentions,
    isTrackingStarted,
  ) => {
    /**
     * Both Mentions and Selections are 0-th index based in the strings
     * moveCursorToMentionBoundry will move cursor to the start
     * or to the end of mention based on user traverse direction.
     */

    const sel = { ...selection };
    if (isTrackingStarted) return sel;
    mentions.forEach((value, [menStart, menEnd]) => {
      if (prevSelc.start > sel.start) {
        //traversing Right -to- Left  <=
        if (EU.between(sel.start, menStart, menEnd)) {
          //move cursor to the start of mention
          sel.start = menStart;
          sel.end = menStart;
        }
      } else {
        //traversing Left -to- Right =>
        if (EU.between(sel.start - 1, menStart, menEnd)) {
          //move cursor to the end of selection
          sel.start = menEnd + 1;
          sel.end = menEnd + 1;
        }
      }
    });
    return sel;
  },
  between: (x, min, max) => x >= min && x <= max,
  sum: (x, y) => x + y,
  diff: (x, y) => Math.abs(x - y),
  isEmpty: str => str === "",
  getMentionsWithInputText: inputText => {
    /**
     * translate provided string e.g. `Hey @[mrazadar](id:1) this is good work.`
     * populate mentions map with [start, end] : {...user}
     * translate inputText to desired format; `Hey @mrazadar this is good work.`
     */

    const map = new Map();
    let newValue = "";

    if (inputText === "") return null;
    const retLines = inputText.split("\n");

    retLines.forEach((retLine, rowIndex) => {
      const mentions = EU.findMentions(retLine);
      if (mentions.length) {
        let lastIndex = 0;
        let endIndexDiff = 0;
        mentions.forEach((men, index) => {
          newValue = newValue.concat(retLine.substring(lastIndex, men.start));
          const name = `${men.name}`;
          newValue = newValue.concat(name);
          const menEndIndex = men.start + (name.length - 1);
          map.set([men.start - endIndexDiff, menEndIndex - endIndexDiff], {
            id: men.id,
            name: men.name,
          });
          //indexes diff with the new formatted string.
          endIndexDiff = endIndexDiff + Math.abs(men.end - menEndIndex);
          //update last index
          lastIndex = men.end + 1;
          if (mentions.length - 1 === index) {
            const lastStr = retLine.substr(lastIndex); //remaining string
            newValue = newValue.concat(lastStr);
          }
        });
      } else {
        newValue = newValue.concat(retLine);
      }
      if (rowIndex !== retLines.length - 1) {
        newValue = newValue.concat("\n");
      }
    });
    return {
      map,
      newValue,
    };
  },
  findMentions: val => {
    /**
     * Both Mentions and Selections are 0-th index based in the strings
     * meaning their indexes in the string start from 0
     * findMentions finds starting and ending positions of mentions in the given text
     * @param val string to parse to find mentions
     * @returns list of found mentions
     */
    let reg = /(@|#)([^#@^\s-.]*)/gim;
    let indexes = [];
    while ((match = reg.exec(val))) {
      indexes.push({
        start: match.index,
        end: reg.lastIndex - 1,
        name: match[0],
        type: EU.specialTagsEnum.mention,
      });
    }
    return indexes;
  },
  /**
   * Get text + list of mentions from text containing mentions.
   * @param data (data containing the text with mentions and the displayValue).
   * @returns object of text (displayText) and found mentions
   */
  getTextAndMentions: data => {
    const mentions = EU.findMentions(data.text);
    const mentionsObject = {};
    mentions.forEach(m => {
      mentionsObject[m.name] = m.id;
    });

    return {
      text: data.displayText,
      mentions: mentionsObject,
    };
  },
  whenTrue: (next, current, key) => {
    /**
     * whenTrue function will be used to check the
     * boolean props for the component
     * @params {current, next, key}
     * @next: this.props
     * @current: nextProps
     * @key: key to lookup in both objects
     * and will only returns true. if nextProp is true
     * and nextProp is a different version/value from
     * previous prop
     */
    return next[key] && next[key] !== current[key];
  },
  displayTextWithMentions: displayTextWithMentions,
};

export default EU;
