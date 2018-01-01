import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Linking
} from 'react-native';

export default class InfoTab extends Component {

  goToLink(url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  render() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>About Native-Land.ca</Text>
        <View style={{paddingTop: 15}}>
          <Text style={styles.tabText2}>My name is Victor. I am a settler, born in traditional Katzie territory and raised in the Okanagan. I am concerned about many of the issues raised by using maps and colonial ways of thinking when it comes to maps. For instance, who has the right to define where a particular territory ends, and another begins? Who should I speak to about such matters?</Text>
          <Text style={styles.tabText2}>There are over 630 different First Nations in Canada and I am not sure of the right process to map territories, languages, and treaties respectfully - and if it is even possible to do respectfully. I am not at all sure about the right way to go about this project, so I would very much appreciate your input.</Text>
          <Text style={styles.tabText2}>I feel that maps are inherently colonial, in that they delegate power according to imposed borders that never really existed in many nations throughout history. They were rarely created in good faith, and are often used in wrong ways. I am open to criticism about this project and I welcome suggestions and changes.</Text>
          <Text style={styles.tabText3}>Go to <Text style={{color: '#0645AD'}} onPress={this.goToLink.bind(this,'http://native-land.ca')}>http://native-land.ca</Text> for more resources and to get in touch with me.</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabContent : {
    padding : 15,
    paddingTop: 30,
    backgroundColor: '#FFF'
  },
  tabText : {
    fontWeight : 'bold',
    fontSize : 15,
    textAlign : 'center'
  },
  tabText2 : {
    fontSize : 13,
    paddingTop: 15
  },
  tabText3 : {
    fontSize : 16,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingBottom: 50
  }
});
