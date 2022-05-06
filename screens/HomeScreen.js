import React, { useState } from "react";

import { StyleSheet, ImageBackground } from "react-native";

import { Button, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import { connect } from "react-redux";

function HomeScreen(props) {
  const [pseudo, setPseudo] = useState("");

  return (
    <ImageBackground source={require("../assets/home.jpg")} style={styles.container}>
      {/* Input for user nickname */}
      <Input
        containerStyle={{ marginBottom: 25, width: "70%" }}
        inputStyle={{ marginLeft: 10 }}
        placeholder="Your Nickname"
        leftIcon={{ type: "ion-icons", name: "person", color: "#eb4d4b" }}
        onChangeText={(val) => setPseudo(val)}
      />
      <Button
        icon={<Ionicons name="arrow-forward" size={24} color="#eb4d4b" />}
        title=" Go to Map"
        type="solid"
        onPress={() => {
          props.onSubmitPseudo(pseudo);
          props.navigation.navigate("BottomMenuTabs", { screen: "Map" });
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmitPseudo: function (pseudo) {
      dispatch({ type: "savePseudo", pseudo: pseudo });
    },
  };
}

export default connect(null, mapDispatchToProps)(HomeScreen);
