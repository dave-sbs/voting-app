import { Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

/**
 * HamburgerMenu Component
 * 
 * This component creates a hamburger menu that can be positioned on either the left or right side of the screen.
 * It provides navigation options to the Admin Page and Summary Page.
 * 
 * Props:
 * - sideChoice: 'left' | 'right' - Determines the position of the menu
 * 
 * Behavior:
 * 1. Initially, only a hamburger icon (≡) is visible.
 * 2. Tapping the icon opens the menu, revealing navigation options.
 * 3. The menu can be closed by tapping a close button (X) at the top.
 * 4. Selecting a navigation option closes the menu and routes to the chosen page.
 * 
 * Styling:
 * - Uses Tailwind CSS classes for styling
 * - Adapts its position based on the sideChoice prop
 * - Menu appears with a subtle shadow and rounded bottom corners when open
 */
const HamburgerMenu = ({ sideChoice }: { sideChoice: 'left' | 'right' }) => {
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    return (
        <View style={{ position: 'absolute', [sideChoice]: 0, zIndex: 100, backgroundColor: 'white', paddingBottom: 8, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
        {/* // <View className={`absolute ${sideChoice === 'left' ? 'left-0' : 'right-0'} z-10 bg-gray-300 rounded-b-md shadow-md`}> */}
            {!showMenu ? (
                <TouchableOpacity
                    onPress={() => setShowMenu(true)}
                    activeOpacity={0.8}
                    className="px-4 pt-2"
                >
                    <Text className='text-6xl text-bold text-gray-800'>
                        ≡
                    </Text>
                </TouchableOpacity>
            ) : (
                <View className={`py-2 w-[280px] h-[200px] bg-gray-100 rounded-md shadow shadow-gray-200`}>
                    <View className={`items-end justify-center px-8`}>
                        <TouchableOpacity
                            onPress={() => setShowMenu(false)}
                            activeOpacity={0.8}
                            className='border-0.5 border-slate-400 px-2 rounded-sm bg-red-500'
                        >
                            <Text className='text-3xl font-bold text-gray-800'>X</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='items-center justify-center mt-4'>
                        <TouchableOpacity
                            onPress={() => {
                                setShowMenu(false); 
                                router.push('/SignIn');
                            }}
                            activeOpacity={0.8}
                            className={`bg-green-800 py-3 px-2 rounded-md w-[240px] justify-center items-center`}
                        >
                            <Text className='text-orange-500 font-bold text-xl'>Go to Admin Page</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='items-center justify-center mt-4'>
                        <TouchableOpacity
                            onPress={() => {
                                setShowMenu(false); 
                                router.push('/SummaryPageAuth');
                            }}
                            activeOpacity={0.8}
                            className={`bg-green-800 py-3 px-2 mb-6 rounded-md w-[240px] justify-center items-center`}
                        >
                            <Text className='text-orange-500 font-bold text-xl'>Go to Summary Page</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default HamburgerMenu;
