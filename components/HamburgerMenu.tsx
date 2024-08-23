import { Text, Image, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router';

const HamburgerMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    return (
        <View className='absolute right-0 top-0'>
            <View className={`${!showMenu ? 'block' : 'hidden'}`}>
                <TouchableOpacity
                    onPress={() => setShowMenu(!showMenu)}
                    activeOpacity={0.8}
                    className="px-4 pt-2"
                >
                    <Text className='text-4xl text-gray-400'>
                        ≡
                    </Text>
                </TouchableOpacity>
            </View>
            <View className={`${showMenu ? 'block' : 'hidden'} w-[300px] h-[120px] bg-white rounded-b-md shadow shadow-gray-200`}>
                <View className='items-center justify-center'>
                    <TouchableOpacity
                                onPress={() => router.push('/SignIn')}
                                activeOpacity={0.8}
                                className={`bg-black py-3 px-2 rounded-md w-[240px] justify-center items-center mt-4`}
                            >
                            <Text className='text-white font-medium text-xl'>Go to admin page</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default HamburgerMenu