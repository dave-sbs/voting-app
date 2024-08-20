import { Button, View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { CandidatesContext } from '@/app/(context)/CandidatesContext';

const MinimumChoiceInput = () => {

    const { minChoice, setMinChoice } = useContext(CandidatesContext)!;
    const [newMinChoice, setMinChoiceState] = useState(0);

    const handleSubmit = () => {
        if (newMinChoice) {
            setMinChoiceState(newMinChoice);
            setMinChoice(newMinChoice);
        }
    };


  return (
    <View className="p-4">
        <Text className="text-xl font-bold mt-8 mb-4">Current Minimum Selection Choice: {minChoice}</Text>
        <View className=''>
            <TextInput
                placeholder="Set Minimum Candidates Choice"
                value={newMinChoice.toString()}
                onChangeText={(text) => setMinChoiceState(Number(text))}
                className="border-b w-[7%] item-center justify-center p-2"
            />
            <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                className={`bg-blue-500 p-1 rounded-md h-[40px] w-[120px] justify-center items-center mt-4`}
            >
                <Text className='text-white font-medium text-md'>Save Changes</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default MinimumChoiceInput

