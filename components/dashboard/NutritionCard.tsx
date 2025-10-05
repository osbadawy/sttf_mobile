import { Image, Text, TouchableOpacity, View } from "react-native";

export default function NutritionCard() {
  const consumed = 924;
  const goal = 2802;
  const progress = consumed / goal;

  return (
    <View className="bg-white mt-20 rounded-2xl p-5 shadow-md overflow-hidden relative">
      {/* Top Row */}
      <View className="flex-row items-center mb-4">
        <Image
          source={require("../../assets/images/leaf.png")}
          className="w-5 h-5 mr-2"
          resizeMode="contain"
        />
        <Text className="text-green-700 font-semibold text-base">
          Nutrition
        </Text>
        <Text className="ml-auto text-gray-400">{">"}</Text>
      </View>

      {/* Calories */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-3xl font-bold">
          {consumed} <Text className="text-base font-normal">Kcal</Text>
        </Text>
        <Text className="text-gray-500">{goal} Kcal</Text>
      </View>

      {/* Progress Bar */}
      <View className="w-full h-1.5 bg-gray-200 rounded-full mb-4">
        <View
          className="h-1.5 bg-green-600 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </View>

      {/* Text + Button */}
      <View className="flex-row items-center justify-between mt-6 mb-40">
        <Text className="text-gray-600 w-1/2 text-sm">
          Great Start! You’re on track towards your calories goal
        </Text>
        <TouchableOpacity className="bg-green-700 px-10 py-4 rounded-lg">
          <Text className="text-white font-medium">Insert Meal</Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Background */}
      <Image
        source={require("../../assets/images/nutritionCircle.png")}
        className="absolute bottom-0 right-0 w-50 h-100"
        resizeMode="contain"
      />
    </View>
  );
}
