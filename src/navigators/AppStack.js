
//import {createStackNavigator,} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Tabs } from './bottomTabNavigator'


export const AppStack = createStackNavigator(
    {
        Tabs: {
            screen: Tabs,
            navigationOptions: ({ navigation }) => ({
                gesturesEnabled: false,
            })
        }
    }
);