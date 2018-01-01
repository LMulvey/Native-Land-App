import React, { Component } from 'react';
import MapView from 'react-native-maps';

import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  Switch,
  StatusBar,
  View,
  Navigator,
  Dimensions,
  Button,
  Linking
} from 'react-native';

function get_random_color2()
{
    var r = function () { return Math.floor(Math.random()*256) };
    return "rgba(" + r() + "," + r() + "," + r() + ",0.5)";
}

function savePolygons(responseJson,appendText) {
  var thesePolygons = [];
  var theseNames = [];
  for(var i=0;i<responseJson.features.length;i++) {
    var thisPolygon = [];
    for(var k=0;k<responseJson.features[i].geometry.coordinates[0][0].length;k++) {
      thisPolygon.push({
        latitude : responseJson.features[i].geometry.coordinates[0][0][k][1],
        longitude : responseJson.features[i].geometry.coordinates[0][0][k][0],
        color : get_random_color2(),
        name : responseJson.features[i].properties.Name,
        description : responseJson.features[i].properties.description
      });
    }
    theseNames.push(responseJson.features[i].properties.Name + appendText);
    thesePolygons.push(thisPolygon);
  }
  return {
    polygons: thesePolygons,
    names : theseNames
  }
}

export default class MapTab extends Component {

  constructor() {
    super();
    this.onPolygonPress = this.onPolygonPress.bind(this);
    this._loadInitialState = this._loadInitialState.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.state = {
      // Map state stuff
      languagePolygons : [],
      territoryPolygons : [],
      treatyPolygons : [],
      treatiesSwitch : false,
      languagesSwitch : true,
      territoriesSwitch : false,
      clickedPolygon : false,
      selectedData : false,
      region : {
        latitude: 37.0902,
        longitude: -95.7129,
        latitudeDelta: 30,
        longitudeDelta: 30,
      }
    }
  }

  componentDidMount() {
    // Geolocate user
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        };
        this.setState({region:region});
      },
      (error) => console.log('not-geolocated'),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      };
      this.setState({region:region});
    });
    // Get data
    this._loadInitialState().done();
  }

  _loadInitialState = async () => {
    // Territories
    var that = this;
    try {
      const value = await AsyncStorage.getItem('NativeLandterritoryPolygons');
      if (value !== null) {
        that.setState({territoryPolygons:JSON.parse(value)});
        AsyncStorage.getItem('NativeLandterritoryPolygonsNames', (err, value) => {
          that.props.addToData(JSON.parse(value));
        });
      } else {
        fetch('https://native-land.ca/coordinates/indigenousTerritories.json')
          .then((response) => response.json())
          .then((responseJson) => {
            var thesePolygons = savePolygons(responseJson,' (territory)');
            that.setState({territoryPolygons:thesePolygons.polygons});
            that.props.addToData(thesePolygons.names);
            AsyncStorage.setItem('NativeLandterritoryPolygons', JSON.stringify(thesePolygons.polygons));
            AsyncStorage.setItem('NativeLandterritoryPolygonsNames', JSON.stringify(thesePolygons.names));
        }).catch((error) => {
            console.error(error);
        });
      }
    } catch (error) {
      // Error retrieving data
    }
    // Languages
    try {
      const value = await AsyncStorage.getItem('NativeLandlanguagePolygons');
      if (value !== null) {
        that.setState({languagePolygons:JSON.parse(value)});
        AsyncStorage.getItem('NativeLandlanguagePolygonsNames', (err, value) => {
          that.props.addToData(JSON.parse(value));
        });
      } else {
        fetch('https://native-land.ca/coordinates/indigenousLanguages.json')
          .then((response) => response.json())
          .then((responseJson) => {
            var thesePolygons = savePolygons(responseJson,' (language)');
            that.setState({languagePolygons:thesePolygons.polygons});
            that.props.addToData(thesePolygons.names);
            AsyncStorage.setItem('NativeLandlanguagePolygons', JSON.stringify(thesePolygons.polygons));
            AsyncStorage.setItem('NativeLandlanguagePolygonsNames', JSON.stringify(thesePolygons.names));
        }).catch((error) => {
            console.error(error);
        });
      }
    } catch (error) {
      // Error retrieving data
    }
    // Treaties
    try {
      const value = await AsyncStorage.getItem('NativeLandtreatyPolygons');
      if (value !== null) {
        that.setState({treatyPolygons:JSON.parse(value)});
        AsyncStorage.getItem('NativeLandtreatyPolygonsNames', (err, value) => {
          that.props.addToData(JSON.parse(value));
        });
      } else {
        fetch('https://native-land.ca/coordinates/indigenousTreaties.json')
          .then((response) => response.json())
          .then((responseJson) => {
            var thesePolygons = savePolygons(responseJson,' (treaty)');
            that.setState({treatyPolygons:thesePolygons.polygons});
            AsyncStorage.setItem('NativeLandtreatyPolygons', JSON.stringify(thesePolygons.polygons));
            AsyncStorage.setItem('NativeLandtreatyPolygonsNames', JSON.stringify(thesePolygons.polygons));
            that.props.addToData(thesePolygons.names);
        }).catch((error) => {
            console.error(error);
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  componentWillReceiveProps(nextProps) {
    const { languagePolygons, territoryPolygons, treatyPolygons } = this.state;
    if(this.state.selectedData!==nextProps.selectedData) {
      // Pick the right map panel to show and highlight this poly
      var polyArray = [territoryPolygons,languagePolygons,treatyPolygons];
      for(var i=0;i<polyArray.length;i++) {
        var clickedPolygon = false;
        var extraText = '';
        if(i===0) { extraText = ' (territory)';
        } else if (i===1) { extraText = ' (language)';
        } else if (i===2) { extraText = ' (treaty)' }
        for(var k=0;k<polyArray[i].length;k++) {
          if(polyArray[i][k][0].name + extraText===nextProps.selectedData) {
            clickedPolygon = polyArray[i][k][0];
          }
        }
        if(clickedPolygon) {
          var center = {
            latitude: clickedPolygon.latitude,
            longitude: clickedPolygon.longitude,
            latitudeDelta: 10,
            longitudeDelta: 10
          }
          if(i===0) {
            this.setState({region:center,clickedPolygon:clickedPolygon,territoriesSwitch:true,languagesSwitch:false,treatiesSwitch:false,selectedData:nextProps.selectedData});
            return;
          } else if (i===1) {
            this.setState({region:center,clickedPolygon:clickedPolygon,territoriesSwitch:false,languagesSwitch:true,treatiesSwitch:false,selectedData:nextProps.selectedData});
            return;
          } else if (i===2) {
            this.setState({region:center,clickedPolygon:clickedPolygon,territoriesSwitch:false,languagesSwitch:false,treatiesSwitch:true,selectedData:nextProps.selectedData});
            return;
          }
        }
      }
    }
  }

  onRegionChange(region) {
    this.setState({
      region : region
    });
  }

  onPolygonPress(languagePolygon,stuff) {
    this.setState({
      clickedPolygon : languagePolygon
    });
  }

  goToLink(url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  render() {

    var theseLinks = false;
    if(this.state.clickedPolygon) {
      theseLinks = this.state.clickedPolygon.description.split(',');
    }

    return (
      <MapView.Animated
        style={styles.mainmap}
        onRegionChange={this.onRegionChange}
        region={this.state.region}
        showsUserLocation={true} >
        <View style={styles.legend}>
            {this.state.clickedPolygon ?
              <View style={styles.legendRow}>
                <View style={{width:20,height:20,marginTop:8,backgroundColor:this.state.clickedPolygon.color}} />
                <Text style={styles.legendText}>{this.state.clickedPolygon.name}</Text>
                {theseLinks.map((link, i) => {
                  return (
                    <Button style={{width:50,height:50}}
                      key={'link-'+i}
                      title={(i+1).toString()}
                      onPress={this.goToLink.bind(this,link)}>Link</Button>
                  )
                })}
               </View>
              : <Text style={styles.legendText}>[nation name]</Text>
            }
        </View>
        <View style={styles.switchLegend}>
          <View style={styles.switches}>
            <Switch
              onValueChange={(value) => this.setState({territoriesSwitch: value})}
              value={this.state.territoriesSwitch}
            />
            <Text style={styles.switchLegendText}>Territories</Text>
          </View>
          <View style={styles.switches}>
            <Switch
              onValueChange={(value) => this.setState({languagesSwitch: value})}
              value={this.state.languagesSwitch}
            />
            <Text style={styles.switchLegendText}>Languages</Text>
          </View>
          <View style={styles.switches}>
            <Switch
              onValueChange={(value) => this.setState({treatiesSwitch: value})}
              value={this.state.treatiesSwitch}
            />
            <Text style={styles.switchLegendText}>Treaties</Text>
          </View>
        </View>
        {this.state.territoriesSwitch ?
          this.state.territoryPolygons.map((territoryPolygon, i) => {
            var fillColor = territoryPolygon[0].color;
            if(this.state.clickedPolygon) {
              if(this.state.clickedPolygon.color===fillColor) {
                fillColor = fillColor.replace(',0.5',',0.9');
              }
            }
            return (
              <MapView.Polygon
                coordinates={territoryPolygon}
                fillColor={fillColor}
                strokeColor={'#333333'}
                key={'tpolygon-'+i}
                onPress={this.onPolygonPress.bind(this,territoryPolygon[0])}>
              </MapView.Polygon>
            )
          })
        : false}
        {this.state.languagesSwitch ?
          this.state.languagePolygons.map((languagePolygon, i) => {
            var fillColor = languagePolygon[0].color;
            if(this.state.clickedPolygon) {
              if(this.state.clickedPolygon.color===fillColor) {
                fillColor = fillColor.replace(',0.5',',0.9');
              }
            }
            return (
              <MapView.Polygon
                coordinates={languagePolygon}
                fillColor={fillColor}
                strokeColor={'#333333'}
                key={'lpolygon-'+i}
                onPress={this.onPolygonPress.bind(this,languagePolygon[0])}>
              </MapView.Polygon>
            )
          })
        : false}
        {this.state.treatiesSwitch ?
          this.state.treatyPolygons.map((treatyPolygon, i) => {
            var fillColor = treatyPolygon[0].color;
            if(this.state.clickedPolygon) {
              if(this.state.clickedPolygon.color===fillColor) {
                fillColor = fillColor.replace(',0.5',',0.9');
              }
            }
            return (
              <MapView.Polygon
                coordinates={treatyPolygon}
                fillColor={fillColor}
                strokeColor={'#333333'}
                key={'trpolygon-'+i}
                onPress={this.onPolygonPress.bind(this,treatyPolygon[0])}>
              </MapView.Polygon>
            )
          })
        : false}
      </MapView.Animated>
      )
  }
}


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainmap : {
    flex: 1,
    alignItems: 'stretch'
  },
  legend : {
    bottom: 100,
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#999',
    alignItems : 'center',
  },
  legendRow : {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    alignSelf: 'center',
  },
  legendText : {
    textAlign : 'center',
    fontSize : 15,
    fontWeight : 'bold',
    padding : 10
  },
  switchLegend : {
    bottom : 47,
    position: 'absolute',
    backgroundColor: '#ccc',
    padding: 4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switches : {
    flex: 3,
    alignItems : 'center',
    flexDirection: 'column',
  },
  switchLegendText : {
    fontSize: 13,
    fontStyle : 'italic',
    color: '#fff'
  }
});
