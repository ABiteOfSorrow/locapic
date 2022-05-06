import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
//if message not working, change adress (ipconfig - ip)
var socket = socketIOClient("http://192.168.10.128:3000");
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

import { Button, ListItem, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
// import { Dimensions } from "react-native";
// for using width 100%
// const Width = Dimensions.get('window').width;
// for using height 100%
// const height = Dimensions.get('window').height;
// style = {{width: Width}}

function ChatScreen(props) {
  //Setter for messages
  const [currentMessage, setCurrentMessage] = useState("");
  //Setter for message list
  const [listMessage, setListMessage] = useState([]);

  useEffect(() => {
    //Receive message from backend
    socket.on("sendMessageToAll", (msg) => {
      setListMessage([...listMessage, msg]);
    });
  }, [listMessage]);

  //Receive message from front and send to backend
  var addMessage = (text, user) => {
    let msg = {
      messages: text,
      pseudo: user,
    };
    socket.emit("sendMessage", { msg });

    setCurrentMessage("");
  };

  // Change emoticons to emoji && F word change to [censored]
  let messageLoad = listMessage.map((e) => {
    var filteredMessage = e.msg.messages.replace(/:\)/g, "\u263A");
    filteredMessage = filteredMessage.replace(/:\(/g, "\u2639");
    filteredMessage = filteredMessage.replace(/:p/g, "\uD83D\uDE1B");
    filteredMessage = filteredMessage.replace(/[a-z]*fuck[a-z]*/gi, "[censored]");
    return (
      <ListItem>
        <ListItem.Content>
          <ListItem.Title>{filteredMessage}</ListItem.Title>
          <ListItem.Subtitle>{e.msg.pseudo}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  });

  return (
    //Content area
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 50 }}>{messageLoad}</ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Input
          containerStyle={{ marginBottom: 5 }}
          placeholder="Your message"
          onChangeText={(val) => setCurrentMessage(val)}
          value={currentMessage}
        />
        <Button
          onPress={() => addMessage(currentMessage, props.pseudo)}
          icon={<Ionicons name="mail-outline" size={24} color="#ffffff" />}
          title=" Send"
          buttonStyle={{ backgroundColor: "#eb4d4b" }}
          type="solid"
        ></Button>
      </KeyboardAvoidingView>
    </View>
  );
}

//receive state pseudo from store for using pseudo
function mapStateTtoProps(state) {
  return { pseudo: state.pseudo };
}

export default connect(mapStateTtoProps, null)(ChatScreen);
