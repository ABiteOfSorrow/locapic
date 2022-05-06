import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal, Pressable } from "react-native";
import { Button, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import { connect } from "react-redux";

function MapScreen(props) {
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [addPOI, setAddPOI] = useState(false);
  const [listPOI, setListPOI] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [titrePOI, setTitrePOI] = useState();
  const [descPOI, setDescPOI] = useState();
  const [tempPOI, setTempPOI] = useState();

  //Ask permission of location, set default location
  useEffect(() => {
    async function askPermissions() {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      // let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 2 }, (location) => {
          setCurrentLatitude(location.coords.latitude);
          setCurrentLongitude(location.coords.longitude);
        });
      }
    }
    askPermissions();
  }, []);

  //Set list POI for each change
  useEffect(() => {
    setListPOI(props.POI);
  }, [props.POI]);

  //Add marker on map
  var markerInput = (e) => {
    if (addPOI) {
      setAddPOI(false);
      setModalVisible(true);
      setTempPOI({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      });
    }
  };

  //If title & description are not empty send info to POI screen & map
  var handleSubmit = () => {
    if (titrePOI != null && descPOI != null) {
      setListPOI([
        ...listPOI,
        {
          longitude: tempPOI.longitude,
          latitude: tempPOI.latitude,
          titre: titrePOI,
          description: descPOI,
        },
      ]);
      var sendPOI = {
        longitude: tempPOI.longitude,
        latitude: tempPOI.latitude,
        titre: titrePOI,
        description: descPOI,
      };
      setModalVisible(false);
      setTempPOI();
      setDescPOI();
      setTitrePOI();
      props.onSubmitListPOI(sendPOI);
    } else {
      alert("Have you forgotten anything? \n Please check the field");
    }
  };

  //Listing marker on map
  var markerPOI = listPOI.map((POI, i) => {
    return (
      <Marker
        key={i}
        coordinate={{ latitude: POI.latitude, longitude: POI.longitude }}
        title={POI.titre}
        description={POI.description}
        pinColor="blue"
        opacity={1} // Modifier l'opacité
      />
    );
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Modal for input info of marker */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Input
              containerStyle={{ marginBottom: 25 }}
              placeholder="titre"
              onChangeText={(val) => setTitrePOI(val)}
            />

            <Input
              containerStyle={{ marginBottom: 25 }}
              placeholder="description"
              onChangeText={(val) => setDescPOI(val)}
            />
            <Pressable
              style={[styles.ModalButton, styles.buttonClose]}
              onPress={() => handleSubmit()}
              type="solid"
            >
              <Text style={styles.textStyle}>Ajouter POI</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <MapView
        onPress={(e) => markerInput(e)}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 48.866667, // pour centrer la carte
          longitude: 2.333333,
          latitudeDelta: 0.0922, // le rayon à afficher à partir du centre
          longitudeDelta: 0.0421,
        }}
      >
        {/* Default marker for user location */}
        <Marker
          key={"currentPos"}
          coordinate={{ latitude: currentLatitude, longitude: currentLongitude }}
          title="Hello"
          description="I am here"
          draggable // Rendre le marqueur drag & dropable
          pinColor="red"
          opacity={1} // Modifier l'opacité
        />
        {markerPOI}
      </MapView>
      {/* Add POI button in bottom */}
      <Button
        disabled={addPOI}
        title=" Add POI"
        icon={<Ionicons name="location" size={24} color="#ffffff" />}
        buttonStyle={{ backgroundColor: "#eb4d4b" }}
        type="solid"
        onPress={() => setAddPOI(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    height: "90%",
    marginTop: 50,
    margin: 30,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ModalButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: "90%",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#eb4d4b",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

// set state POI to props for use
function mapStateTtoProps(state) {
  return { POI: state.listPOI };
}

// Send POI info to store for save
function mapDispatchToProps(dispatch) {
  return {
    onSubmitListPOI: function (POI) {
      dispatch({ type: "savePOI", POI: POI });
    },
  };
}

export default connect(mapStateTtoProps, mapDispatchToProps)(MapScreen);
