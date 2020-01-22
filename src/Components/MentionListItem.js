import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Components
import Avatar from "./Avatar";

export class MentionListItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object,
    onSuggestionTap: PropTypes.func,
    editorStyles: PropTypes.object
  };

  onSuggestionTap = (user) => {
    this.props.onSuggestionTap(user);
  };

  render() {
    const { item: user, editorStyles } = this.props;
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.suggestionItem, editorStyles.mentionListItemWrapper]}
          onPress={() => this.onSuggestionTap(user)}
        >
          <Avatar
            user={user}
            wrapperStyles={styles.thumbnailWrapper}
            charStyles={styles.thumbnailChar}
          />

          <View style={[styles.text, editorStyles.mentionListItemTextWrapper]}>
            <Text style={[styles.title, editorStyles.mentionListItemTitle]}>
              {user.name}
            </Text>
            <Text
              style={[styles.username, editorStyles.mentionListItemUsername]}
            >
              @{user.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  suggestionItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.1)",
    height: 50,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)"
  },
  text: {
    alignSelf: "center",
    marginLeft: 12
  },
  title: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.8)"
  },
  thumbnailWrapper: {
    width: 35,
    height: 35
  },
  thumbnailChar: {
    fontSize: 16
  }
});


export default MentionListItem;
