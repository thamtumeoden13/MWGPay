// import { createStackNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Home MWG
import Delivery from '@screens/delivery';
import DeliveringDetail from '@screens/delivery/DeliveringDetail'
import DeliveredDetail from '@screens/delivery/DeliveredDetail'

// Lịch sử
import History from '@screens/history';
import HistoryDetail from '@screens/history/HistoryDetail';

// Thông Báo
import Notice from '@screens/notice';

// Cá Nhân
import Profile from '@screens/profile';

// Màn hình lock
import Lock from '@screens/signIn/Lock';

// Màn hình chụp ảnh
import ImagePicker from '@screens/imagePicker';

export const DeliveryStack = createStackNavigator(
    {
        Delivery: Delivery,
        DeliveringDetail: DeliveringDetail,
        DeliveredDetail: DeliveredDetail,
        ImagePicker: ImagePicker,
        Lock: Lock
    },
    {
        initialRouteName: 'Delivery'
    }
);

DeliveryStack.navigationOptions = ({ navigation }) => {

    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export const HistoryStack = createStackNavigator(
    {
        History: History,
        HistoryDetail: HistoryDetail,
        Lock1: Lock
    }
);

HistoryStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export const NoticeStack = createStackNavigator(
    {
        Notice: Notice,
        Lock2: Lock
    }
);

NoticeStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export const ProfileStack = createStackNavigator(
    {
        Profile: Profile,
        Lock3: Lock
    }
);

ProfileStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};