// import {View, Text} from "react-native";
// import {Link} from "expo-router";

// export default function HomeScreen() {
//   return (
//     <View className="flex-1 justify-center items-center">
//       <Text className="text-xl text-blue-500">Hello world !!!</Text>
//       <Link href="/details/1">aller à details 1</Link>
//       <Link
//         href={{
//           pathname: "/details/[detailsId]",
//           params: {detailsId: "bacon"}
//         }}>
//         aller à details 2
//       </Link>
//       <Link href="/details/poulet">aller à details poulet</Link>
//     </View>
//   );
// }

import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Button,
  Modal,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Platform
} from "react-native";

import * as ImagePicker from "expo-image-picker";

interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  age: number;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedAge, setUpdatedAge] = useState<number | string>("");
  const [updatedPhoto, setUpdatedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://192.168.1.67:3000/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const pickImage = async () => {
    // Demander la permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission refusée pour accéder à la galerie !");
      return;
    }

    // Ouvrir le sélecteur d'image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5
    });

    if (!result.canceled) {
      setUpdatedPhoto(result.assets[0].uri);
    }
  };

  const handleUpdatePress = (user: User) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedEmail(user.email);
    setUpdatedAge(user.age.toString());
    setUpdatedPhoto(user.photo);
    setUpdatedPhoto(user.photo);
    setModalVisible(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://192.168.1.67:3000/users/${selectedUser._id}`,
        {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            name: updatedName,
            email: updatedEmail,
            age: parseInt(updatedAge.toString(), 10)
          })
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        console.log(updatedUser);

        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === updatedUser._id
              ? {...updatedUser, photo: updatedPhoto || updatedUser.photo}
              : user
          )
        );
        setModalVisible(false);
      } else {
        console.error("Erreur lors de la mise à jour de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    }
  };

  const renderItem = ({item}: {item: User}) => (
    <View
      key={item._id}
      className="flex-row bg-white rounded-lg shadow p-4 mb-4 items-center">
      <Image source={{uri: item.photo}} className="w-16 h-16 rounded-full" />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-500">{item.email}</Text>
        <Text className="text-sm text-gray-500">{item.age} ans</Text>
      </View>
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="bg-blue-400  px-4 py-2 rounded-md"
          onPress={() => handleUpdatePress(item)}>
          <Text className="text-white font-semibold">Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-400  px-4 py-2 rounded-md"
          onPress={() => deleteUserFromList(item._id)}>
          <Text className="text-white font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={{padding: 16}}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <Text className="text-lg font-bold mb-4">Update User</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-2"
              value={updatedName}
              onChangeText={setUpdatedName}
              placeholder="Name"
            />
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-2"
              value={updatedEmail}
              onChangeText={setUpdatedEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4"
              value={updatedAge.toString()}
              onChangeText={setUpdatedAge}
              placeholder="Age"
              keyboardType="numeric"
            />
            <TouchableOpacity
              className="bg-gray-300 p-3 rounded-lg mb-4"
              onPress={pickImage}>
              <Text className="text-center">Pick Profile Image</Text>
            </TouchableOpacity>
            {updatedPhoto && (
              <Image
                source={{uri: updatedPhoto}}
                className="w-24 h-24 rounded-full self-center mb-4"
              />
            )}
            <Button title="Save" onPress={handleUpdateSubmit} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UserList;
