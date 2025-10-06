import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Store any value in AsyncStorage with a given key
 * @param key - The storage key
 * @param value - The value to store (will be stringified if not a string)
 * @returns Promise<void>
 */
export const storeValue = async (key: string, value: any): Promise<void> => {
  try {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error storing value for key "${key}":`, error);
    throw error;
  }
};

/**
 * Retrieve any value from AsyncStorage with a given key
 * @param key - The storage key
 * @param defaultValue - Default value to return if key doesn't exist
 * @returns Promise<T> - The stored value or default value
 */
export const getValue = async <T = string>(
  key: string,
  defaultValue?: T,
): Promise<T> => {
  try {
    const storedValue = await AsyncStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue as T;
    }

    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return storedValue as T;
    }
  } catch (error) {
    console.error(`Error retrieving value for key "${key}":`, error);
    return defaultValue as T;
  }
};
