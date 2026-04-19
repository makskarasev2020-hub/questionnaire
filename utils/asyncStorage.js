import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export { storeData, getData };
