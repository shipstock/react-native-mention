import React from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

// - Project imports -
// Components
import MentionListItem from "./MentionListItem";
// Constants
import * as Constants from "../Constants/Constants";
import * as Colors from "../Constants/Colors";

export class MentionList extends React.PureComponent {
  static propTypes = {
    customStyles: PropTypes.object,
    fetching: PropTypes.bool,
    horizontal: PropTypes.bool,
    keyword: PropTypes.string,
    list: PropTypes.array,
    onSuggestionTap: PropTypes.func,
    renderMention: PropTypes.func,
    show: PropTypes.bool,
  };

  static defaultProps = {
    horizontal: false,
    fetching: false,
  };

  constructor(props) {
    super(props);
  }

  renderSuggestionsRow = ({ item, index }) => {
    return this.props.renderMention ? (
      this.props.renderMention({ item, index }, this.props.onSuggestionTap)
    ) : (
      <MentionListItem
        onSuggestionTap={this.props.onSuggestionTap}
        item={item}
        customStyles={this.props.customStyles}
      />
    );
  };

  render() {
    const { props } = this;
    let content = null;
    const { fetching, list, show } = props;

    // List styling.
    const IOSListStyle = {
      ...styles.suggestionsPanelStyleIOS,
      top:
        list.length > 0 && !props.horizontal
          ? -(Constants.MENTION_ROW_HEIGHT * list.length) -
            Constants.EXTRA_MENTIONS_OFFSET
          : -Constants.MENTION_ROW_HEIGHT - Constants.EXTRA_MENTIONS_OFFSET,
    };
    const listStyle =
      Platform.OS === "ios"
        ? IOSListStyle
        : styles.suggestionsPanelStyleAndroid;

    // If wanting to show and it has content (avoids borders showing before list has content).
    if (show) {
      content = (
        <View style={[listStyle]}>
          <FlatList
            keyboardShouldPersistTaps={"always"}
            horizontal={props.horizontal}
            ListEmptyComponent={
              fetching ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
            enableEmptySections={true}
            data={list}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={this.renderSuggestionsRow}
          />
        </View>
      );
    }

    return content;
  }
}

const styles = StyleSheet.create({
  suggestionsPanelStyleIOS: {
    position: "absolute",
    zIndex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.MATERIAL_DIVIDER,
  },
  suggestionsPanelStyleAndroid: {
    backgroundColor: Colors.ANDROID_MENTION_LIST_BACKGROUND,
    borderBottomWidth: 1,
    maxHeight: 300,
    borderColor: Colors.MATERIAL_DIVIDER,
  },
  loaderContainer: {
    height: Constants.MENTION_ROW_HEIGHT,
    width: Constants.MENTION_ROW_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MentionList;
