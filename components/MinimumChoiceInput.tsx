import { Button, View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import CardHeader from './CardHeader';
import LineBreak from './LineBreak';
import SecondaryButton from './SecondaryButton';

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
    <View className="bg-white w-full mt-2">
        <CardHeader title={'Minimum Candidates Selection Choice'} />
        <View className='p-4'>
            <Text className="text-base">Please specify the minimum number of candidates the voters should choose to make a valid submission </Text>
            <View className='flex-row w-[440] mt-4 justify-between items-center'>
                <Text className="text-lg font-bold">Current Minimum Selection Choice:</Text>
                <View className='border rounded-md items-center justify-center'>
                    <Text className="font-semibold mt-2 text-2xl pb-2 px-4 text-green-600">{minChoice}</Text>
                </View>
            </View>
        </View>
        <View className='border-b w-full border-gray-300 shadow-md' />
        <View className='px-4 pt-6 flex-row gap-16 items-center'>
            <Text className='text-xl font-bold'>Change Minimum Selection Choice</Text>  
            <View className='border rounded-md py-2 px-4'>
                <TextInput
                    placeholder="Set Minimum Candidates Choice"
                    value={newMinChoice.toString()}
                    onChangeText={(text) => setMinChoiceState(Number(text))}
                    className="text-2xl text-black"
                />
            </View>
        </View>
        <View className='px-4 mt-1'>
            <SecondaryButton title="Save Changes" handlePress={handleSubmit} />
        </View>
    </View>
  )
}

export default MinimumChoiceInput

