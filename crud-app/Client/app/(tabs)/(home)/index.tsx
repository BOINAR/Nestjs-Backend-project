// import {View, Text} from "react-native";
// import {Link} from "expo-router";

// export default function HomeScreen() {
//   return (
//     <View className="flex-1 justify-center items-center">
//       <Text className="text-xl text-blue-500">nayeff boinariziki🎉</Text>
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
  ActivityIndicator
} from "react-native";

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://10.0.2.2:3000/users");
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

  const handleUpdatePress = (user: User) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedEmail(user.email);
    setUpdatedAge(user.age.toString());
    setModalVisible(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/users/${selectedUser._id}`,
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
            user._id === updatedUser._id ? updatedUser : user
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
      <Button title="Update" onPress={() => handleUpdatePress(item)} />
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
