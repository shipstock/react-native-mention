import React from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  Animated,
  FlatList,
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
    editorStyles: PropTypes.object,
    fetching: PropTypes.bool,
    horizontal: PropTypes.bool,
    isTrackingStarted: PropTypes.bool,
    keyword: PropTypes.string,
    list: PropTypes.array,
    onSuggestionTap: PropTypes.func,
    renderMention: PropTypes.func,
  };

  static defaultProps = {
    horizontal: false,
    fetching: false,
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
    let content = null;
    const { fetching, list, show } = props;

    if (show) {
      content = (
        <Animated.View
          style={[
            {
              top:
                list.length > 0 && !props.horizontal
                  ? -(Constants.MENTION_ROW_HEIGHT * list.length) -
                    Constants.EXTRA_MENTIONS_OFFSET
                  : -Constants.MENTION_ROW_HEIGHT -
                    Constants.EXTRA_MENTIONS_OFFSET,
              ...styles.suggestionsPanelStyle,
            },
            this.props.editorStyles.mentionsListWrapper,
          ]}
        >
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
            renderItem={rowData => {
              return this.renderSuggestionsRow(rowData);
            }}
          />
        </Animated.View>
      );
    }

    return content;
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
  noContentContainer: {
    height: Constants.MENTION_ROW_HEIGHT,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  noContentText: {
    fontSize: 12,
    color: Colors.MATERIAL_SECONDARY_TEXT,
  },
});

export default MentionList;
