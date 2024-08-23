import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

type SecondaryButtonProps = {
  title: string;
  handlePress: () => void;
  isLoading?: boolean;
};

const SecondaryButton = ({ title, handlePress, isLoading = false }: SecondaryButtonProps) => {
  return (
    <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            className={`bg-black p-1 rounded-md h-[40px] w-[120px] justify-center items-center mt-3 mb-4 ${isLoading ? 'opacity-50' : ''}`}
        >
        <Text className='text-white font-semibold text-md'>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default SecondaryButton