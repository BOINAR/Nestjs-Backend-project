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
  ScrollView,
  ActivityIndicator,
  Button
} from "react-native";
import {FlatList} from "react-native-gesture-handler";

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://10.0.2.2:3000/users");
        const data = await response.json();
        console.log(data);

        setUsers(data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const DeleteUserFromList = async (userId: string) => {
    setUsers(users.filter(user => user._id != userId));
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      {users.map(user => (
        <View
          key={user._id}
          className="flex-row bg-white rounded-lg shadow p-4 mb-4 items-center">
          <Image
            source={{uri: user.photo}}
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-lg font-bold text-gray-800">{user.name}</Text>
            <Text className="text-sm text-gray-500">{user.email}</Text>
            <Text className="text-sm text-gray-500">{user.age} ans</Text>
            <Button
              title="Delete"
              onPress={() => DeleteUserFromList(user._id)}></Button>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default UserList;
