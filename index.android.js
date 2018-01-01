/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ToolbarAndroid,
  ViewPagerAndroid,
  List
} from 'react-native';

import AndroidMapTab from './app/Components/AndroidMapTab.js';
import SearchTab from './app/Components/SearchTab.js';
import InfoTab from './app/Components/InfoTab.js';

export default class NativeLand extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab : 'map',
      selectedData : false,
      allData : []
    }
  }

  addToData(data) {
    var newData = this.state.allData.concat(data);
    this.setState({
      allData : newData
    });
  }

  selectedItem(rowData) {
    this.setState({
      selectedTab : 'map',
      selectedData : rowData
    });
  }

  onActionSelected(e) {
    var toReturn = false;
    switch(e) {
      case 0:
        toReturn = 'map';
        break;
      case 1:
        toReturn = 'search';
        break;
      case 2:
        toReturn = 'info';
        break;
    }
    this.setState({
      selectedTab : toReturn
    });
  }

  render() {
    return (
      <View style={styles.container}>
          <ToolbarAndroid
            title="Native Land"
            style={styles.toolbar}
            actions={[{
              title: 'Map',
              icon: require('./img/map.png'),
              show: 'never',
              showWithText : true
            },{
              title: 'Search',
              icon: require('./img/search.png'),
              show: 'never',
              showWithText : true
            },{
              title: 'Info',
              icon: require('./img/info.png'),
              show: 'never',
              showWithText : true
            }]}
            onActionSelected={this.onActionSelected.bind(this)}
          />
          {this.state.selectedTab==='map' ?
            <AndroidMapTab selectedData={this.state.allData} addToData={this.addToData.bind(this)} />
          : false}
          {this.state.selectedTab==='search' ?
            <SearchTab selectedItem={this.selectedItem} dataSource={this.state.allData} />
          : false}
          {this.state.selectedTab==='info' ?
            <InfoTab />
          : false}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar : {
   backgroundColor: '#eee',
   height: 56,
   alignSelf: 'stretch',
  },
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('NativeLand', () => NativeLand);
