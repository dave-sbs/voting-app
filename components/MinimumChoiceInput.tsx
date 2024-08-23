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
            <Text className="pt-4 text-base">Current Minimum Selection Choice: 
                <Text className="font-semibold"> {minChoice}</Text>
            </Text>
        </View>
        <LineBreak />
        <View className='px-4 pt-4 flex-row gap-6 items-center'>
            <Text className='text-base font-bold'>Change Value</Text>  
            <TextInput
                placeholder="Set Minimum Candidates Choice"
                value={newMinChoice.toString()}
                onChangeText={(text) => setMinChoiceState(Number(text))}
                className="border-b-0.5 border-gray-400 text-black py-1 px-1 w-[30px]"
            />
        </View>
        <View className='px-4'>
            <SecondaryButton title="Save Changes" handlePress={handleSubmit} />
        </View>
    </View>
  )
}

export default MinimumChoiceInput

