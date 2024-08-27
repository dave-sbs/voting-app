import { Text, View, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

const HamburgerMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    // Function to close the menu when clicking outside
    const handleOutsidePress = () => {
        console.log('test')
        if (showMenu) {
            setShowMenu(false);
        }
    };

    return (
        <View className='absolute right-0 top-0'>
            <View className={`${!showMenu ? 'block' : 'hidden'}`}>
                <TouchableOpacity
                    onPress={() => setShowMenu(true)}
                    activeOpacity={0.8}
                    className="px-4 pt-2"
                >
                    <Text className='text-6xl text-bold text-gray-800'>
                        ≡
                    </Text>
                </TouchableOpacity>
            </View>

            <View className={`${showMenu ? 'block' : 'hidden'} w-[300px] h-[120px] bg-white rounded-b-md shadow shadow-gray-200`}>
                {/* Close button */}
                <View className='items-end justify-center px-8'>
                    <TouchableOpacity
                        onPress={() => setShowMenu(false)}
                        activeOpacity={0.8}
                        className='border-0.5 border-slate-400 px-2 rounded-sm bg-red-500'
                    >
                        <Text className='text-xl font-bold text-white'>X</Text>
                    </TouchableOpacity>
                </View>

                <View className='items-center justify-center mt-4'>
                    <TouchableOpacity
                        onPress={() => {
                            setShowMenu(false); 
                            router.push('/SignIn');
                        }}
                        activeOpacity={0.8}
                        className={`bg-orange-400 py-3 px-2 rounded-md w-[240px] justify-center items-center`}
                    >
                        <Text className='text-green-800 font-medium text-xl'>Go to admin page</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default HamburgerMenu;
