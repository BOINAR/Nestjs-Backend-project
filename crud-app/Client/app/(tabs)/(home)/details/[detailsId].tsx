import React from "react";
import {useLocalSearchParams} from "expo-router";
import {View, Text} from "react-native";

export default function details() {
  const {detailsId} = useLocalSearchParams();

  return (
    <View>
      <Text>Details de l'utilisateur {detailsId}</Text>
    </View>
  );
}
