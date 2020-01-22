import React from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, FlatList, Animated, View, StyleSheet } from "react-native";

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
      this.props.renderMention({item, index}, this.props.onSuggestionTap)
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

    const { keyword, isTrackingStarted } = props;
    const withoutAtKeyword = keyword.substr(1, keyword.length);
    const list = this.props.list;
    const suggestions =
      withoutAtKeyword !== ""
        ? list.filter(user => user.name.includes(withoutAtKeyword))
        : list;
    if (!isTrackingStarted) {
      return null;
    }
    return (
      <Animated.View
        style={[
          { ...styles.suggestionsPanelStyle },
          this.props.editorStyles.mentionsListWrapper,
        ]}
      >
        <FlatList
          style={styles.mentionsListContainer}
          keyboardShouldPersistTaps={"always"}
          horizontal={props.horizontal}
          ListEmptyComponent={
            <View style={styles.loaderContainer}>
              <ActivityIndicator />
            </View>
          }
          enableEmptySections={true}
          data={suggestions}
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
  container: {
    // flex:1,
    maxHeight: 300,
  },
  suggestionsPanelStyle: {
    /*
    position: "absolute",
    zIndex: 1,
    top: -Constants.MENTION_ROW_HEIGHT,
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.MATERIAL_DIVIDER,
    */
  },
  loaderContainer: {},
  mentionsListContainer: {
    height: 100,
  },
});


export default MentionList;
