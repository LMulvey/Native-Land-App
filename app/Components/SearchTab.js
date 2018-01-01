import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  TextInput,
  ListView
} from 'react-native';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class SearchTab extends Component {

  constructor(props) {
    super(props);
    this.searchText = this.searchText.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this._pressRow = this._pressRow.bind(this);
    this.state = {
      dataSource : ds.cloneWithRows(this.props.dataSource.sort()),
      text: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource : ds.cloneWithRows(nextProps.dataSource.sort())
    });
  }

  searchText(newText) {
    const { dataSource } = this.props;
    var newDataSource = [];
    dataSource.forEach(function(element,index,array) {
      if(element.indexOf(newText)>-1) {
        newDataSource.push(element);
      }
    });
    this.setState({
      dataSource : ds.cloneWithRows(newDataSource.sort()),
      text : newText
    });
  }

  renderRow(rowData) {
    var plainData = rowData.substr(0,rowData.indexOf('('));
    var appendedData = rowData.substr(rowData.indexOf("(")).replace('(','').replace(')','');
    return (
      <TouchableHighlight
        onPress={this._pressRow.bind(this,rowData)}
        underlayColor="#eee"
        activeOpacity={0.5} >
        <View style={styles.viewBorder}>
          <Text style={styles.listText}>{plainData}</Text>
          <Text style={styles.listDetails}>{appendedData}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  _pressRow(rowData) {
    this.props.selectedItem(rowData);
  }

  render() {
    return (
      <View style={styles.tabContent}>
        <TextInput
          style={{height: 20,margin:10,textAlign:'center'}}
          editable = {true}
          maxLength = {40}
          onChangeText={this.searchText}
          value={this.state.text}
          placeholder='Search nations, languages, and treaties' />
        <ListView
          style={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabContent : {
    flex: 1,
    margin: 0,
    alignItems: 'stretch',
    paddingTop: 40
  },
  tabText : {
    backgroundColor: '#eeeeee',
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  listText : {
    paddingTop : 10,
    fontSize: 16,
    fontWeight : 'bold',
  },
  listDetails : {
    fontSize: 12,
    paddingTop: 1,
    paddingBottom: 10,
    fontStyle: 'italic'
  },
  viewBorder : {
    borderColor : '#eee',
    borderTopWidth : 1,
    borderBottomWidth : 1,
    borderStyle : 'solid',
    paddingLeft: 10,
    paddingRight: 10
  },
  listContent : {
  }
});
