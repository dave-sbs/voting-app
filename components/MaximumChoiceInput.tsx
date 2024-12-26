import { Button, View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useChoiceContext } from '@/app/(context)/VoteChoiceContext';
import CardHeader from './CardHeader';


const MaximumChoiceInput = () => {
    const { maxChoice, updateMaxChoice } = useChoiceContext();
    const [newmaxChoice, setmaxChoiceState] = useState(0);

    const handleSubmit = () => {
        if (newmaxChoice) {
            setmaxChoiceState(newmaxChoice);
            updateMaxChoice(newmaxChoice);
        } else {
            alert('Please make sure the Maximum choice is at least equal to or greater than the Minimum choice');
        }
    };


  return (
    <View className="bg-white w-full mt-2">
        <CardHeader title={'Maximum Candidates Selection Choice'} />
        <View className='p-4'>
            <Text className="text-base">Please specify the maximum number of candidates the voters should choose to make a valid submission </Text>
            <View className='flex-row w-[440] mt-4 justify-between items-center'>
                <Text className="text-lg font-bold">Current Maximum Selection Choice:</Text>
                <View className='border rounded-md items-center justify-center'>
                    <Text className="font-semibold mt-2 text-2xl pb-2 px-4 text-green-600">{maxChoice}</Text>
                </View>
            </View>
        </View>
        <View className='border-b w-full border-gray-300 shadow-md' />
        <View className='px-4 pt-6 flex-row gap-[58px] items-center'>
            <Text className='text-xl font-bold'>Change Maximum Selection Choice</Text>  
            <View className='border rounded-md py-2 px-4'>
                <TextInput
                    placeholder="Set Maximum Candidates Choice"
                    value={newmaxChoice.toString()}
                    onChangeText={(text) => setmaxChoiceState(Number(text))}
                    className="text-2xl text-black"
                />
            </View>
        </View>
        <View className='px-4 mt-1 justify-center items-center'>
            <TouchableOpacity
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    className={`bg-green-800 p-1 rounded-md h-[40px] w-[240px] justify-center items-center mt-3 mb-4`}
                >
                <Text className='text-orange-500 font-semibold text-lg'>
                    Save Changes
                </Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default MaximumChoiceInput
