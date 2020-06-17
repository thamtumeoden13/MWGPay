import React from 'react'
import {
    createBottomTabNavigator,
} from 'react-navigation';

import { Icon } from 'react-native-elements';

import {
    HomeStack,
    HistoryStack,
    PreferentialStack,
    ProfileStack
} from '../stackNavigator'

export const Tabs = createBottomTabNavigator(
    {
        Home: {
            screen: HomeStack,
            navigationOptions: {
                tabBarLabel: 'MWG',
                tabBarIcon: ({ tintColor }) => <Icon name="home" type="font-awesome" size={28} color={tintColor} />
            },
        },
        History: {
            screen: HistoryStack,
            navigationOptions: {
                tabBarLabel: 'Lịch sử GD',
                tabBarIcon: ({ tintColor }) => <Icon name="history" type="font-awesome" size={28} color={tintColor} />,
            },
        },
        Preferential: {
            screen: PreferentialStack,
            navigationOptions: {
                tabBarLabel: 'Ưu đãi',
                tabBarIcon: ({ tintColor }) => <Icon name="gift" type="font-awesome" size={28} color={tintColor} />
            },
        },
        Profile: {
            screen: ProfileStack,
            navigationOptions: {
                tabBarLabel: 'Ví của tôi',
                tabBarIcon: ({ tintColor }) => <Icon name="user" type="font-awesome" size={28} color={tintColor} />
            },
        },
    },
    {
        initialRouteName: 'Home'
    }
);
Tabs.navigationOptions = {
    // Hide the header from AppNavigator stack
    header: null,
};