import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

type PrimaryButtonProps = {
  title: string;
  handlePress: () => void;
  color: string;
  otherProps?: string;
  isLoading: boolean;
};

const PrimaryButton = ({ title, handlePress, color, otherProps, isLoading }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className={`${color} p-4 rounded-md min-h-[48px] min-w-[48px] justify-center items-center ${otherProps} ${isLoading ? 'opacity-50' : ''}`}
        >
        <Text className='text-white font-medium text-xl'>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default PrimaryButton