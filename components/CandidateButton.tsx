import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

type CandidateButtonProps = {
  title: string;
  handlePress: () => void;
  color: string;
  otherProps?: string;
  isLoading: boolean;
};

const CandidateButton = ({ title, handlePress, color, otherProps, isLoading }: CandidateButtonProps) => {
  return (
    <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className={`${color} p-2 rounded-md min-h-[20px] min-w-[140px] max-w-[160px] justify-center items-center ${otherProps} ${isLoading ? 'opacity-50' : ''}`}
        >
        <Text className={`${color === 'bg-indigo-500' ? 'text-white' : 'text-white'} font-medium text-sm`}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default CandidateButton