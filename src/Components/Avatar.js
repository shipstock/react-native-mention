import React from "react";
import PropTypes from "prop-types";

import { StyleSheet, Text, View } from "react-native";

const getFirstChar = str => str.charAt(0).toUpperCase();

const alphabetColors = [
  "#FFD552",
  "#ffca0b",
  "#9C0D05",
  "#E1DB00",
  "#E99600",
  "#E1DB00",
  "#06BC0C",
  "#06BCAE",
  "#0695BC",
  "#0660BC",
  "#3006BC",
  "#6606BC",
  "#c31616",
  "#BC0680",
  "#BC0642",
  "#BC3406",
  "#BCA106",
  "#535322",
  "#497724",
  "#929292",
  "#606060",
  "#262626",
  "#7B9FAB",
  "#1393BD",
  "#5E13BD",
  "#E208A7"
];

const UserThumbnail = props => {
  const { user } = props;
  let name = user && user.name;
  if (!name || name === "") {
    if (user && user.first_name && user.last_name) {
      name = `${user.first_name} ${user.last_name}`;
    } else {
      return null;
    }
  }
  const text = getFirstChar(name);
  const bgIndex = Math.floor(text.charCodeAt(0) % alphabetColors.length);
  const bgColor = alphabetColors[bgIndex];

  return (
    <View
      style={[
        styles.wrapper,
        props.wrapperStyles,
        { backgroundColor: bgColor }
      ]}
    >
      <Text style={[styles.name, props.charStyles]}>{`${text}`}</Text>
    </View>
  );
};

UserThumbnail.propTypes = {
  user: PropTypes.object,
  wrapperStyles: PropTypes.object,
  charStyles: PropTypes.object,
  to: PropTypes.string
};

const styles = StyleSheet.create({
  wrapper: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff"
  }
});

export default UserThumbnail;
