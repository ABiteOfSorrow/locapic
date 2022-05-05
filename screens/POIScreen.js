import React from "react";
import { StyleSheet, View, ScrollView, KeyboardAvoidingView } from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";

function POIScreen(props) {
  var listPOI = props.POI.map((POI, i) => {
    return (
      <ListItem onPress={() => props.onDeletePOI(POI)}>
        <ListItem.Content>
          <ListItem.Title>Point d'interet : {POI.titre}</ListItem.Title>
          <ListItem.Subtitle>Desc: {POI.description}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  });
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 50 }}>{listPOI}</ScrollView>
    </View>
  );
}

function mapStateTtoProps(state) {
  return { POI: state.listPOI };
}

function mapDispatchToProps(dispatch) {
  return {
    onDeletePOI: function (POI) {
      dispatch({ type: "deletePOI", POI: POI });
    },
  };
}

export default connect(mapStateTtoProps, mapDispatchToProps)(POIScreen);
