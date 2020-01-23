import React from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  FlatList,
  Animated,
  View,
  StyleSheet,
} from "react-native";

// - Project imports -
// Components
import MentionListItem from "./MentionListItem";
// Constants
import * as Constants from "../Constants/Constants";
import * as Colors from "../Constants/Colors";

export class MentionList extends React.PureComponent {
  static propTypes = {
    list: PropTypes.array,
    editorStyles: PropTypes.object,
    horizontal: PropTypes.bool,
    isTrackingStarted: PropTypes.bool,
    suggestions: PropTypes.array,
    keyword: PropTypes.string,
    onSuggestionTap: PropTypes.func,
    renderMention: PropTypes.func,
  };

  static defaultProps = {
    horizontal: false,
  };

  constructor(props) {
    super(props);
    this.previousChar = " ";
  }

  renderSuggestionsRow = ({ item, index }) => {
    return this.props.renderMention ? (
      this.props.renderMention({ item, index }, this.props.onSuggestionTap)
    ) : (
      <MentionListItem
        onSuggestionTap={this.props.onSuggestionTap}
        item={item}
        editorStyles={this.props.editorStyles}
      />
    );
  };
  render() {
    const { props } = this;

    const { isTrackingStarted } = props;
    const list = this.props.list;

    if (!isTrackingStarted) {
      return null;
    }
    return (
      <Animated.View
        style={[
          {
            top:
              list.length > 0
                ? -(Constants.MENTION_ROW_HEIGHT * list.length)
                : -Constants.MENTION_ROW_HEIGHT,
            ...styles.suggestionsPanelStyle,
          },
          this.props.editorStyles.mentionsListWrapper,
        ]}
      >
        <FlatList
          keyboardShouldPersistTaps={"always"}
          horizontal={props.horizontal}
          ListEmptyComponent={
            <View style={styles.loaderContainer}>
              <ActivityIndicator />
            </View>
          }
          enableEmptySections={true}
          data={list}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={rowData => {
            return this.renderSuggestionsRow(rowData);
          }}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  suggestionsPanelStyle: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    borderWidth: 1,
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
