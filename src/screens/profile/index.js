import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import { FlatListComponent } from '@componentsCommon/flatList'

export default class Profile extends Component {
    static navigationOptions = {
        title: 'Cá nhân'
    }
    constructor(props) {
        super(props);
        this.state = {
            infoData1: [
                {
                    name: 'Unknown',
                    img_uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    subtitle: '097 119 6061',
                    route: "PersonalInfo"
                }
            ],
            infoData2: [
                {
                    title: 'Quản lý điểm thưởng',
                    subtitle: '',
                    icon: 'credit-card',
                    type: 'font-awesome',
                    route: 'PartnerConnect2'
                },
                {
                    title: 'Hoá đơn',
                    subtitle: "chưa có hoá đơn",
                    rightTitle: "Thêm hoá đơn",
                    icon: 'list-alt',
                    type: 'font-awesome'
                },
                {
                    title: 'Thẻ Quà Tặng',
                    subtitle: "Chưa có thẻ quà tặng",
                    rightTitle: "Sử dụng",
                    icon: 'gift',
                    type: 'feather'
                },
                {
                    title: 'Dịch vụ liên kết',
                    subtitle: "Chưa có",
                    rightTitle: "Quản lý",
                    icon: 'link',
                    type: 'feather'
                },
                {
                    title: 'Quản lý nhóm',
                    icon: 'group',
                    type: 'material'
                },
            ],
            infoData3: [
                {
                    title: 'Trung Tâm Hỗ Trợ',
                    subtitle: "1800 1060",
                    icon: 'headphones',
                    type: 'feather',
                    route: 'Support'
                },
                {
                    title: 'Thông Tin Ứng Dụng',
                    icon: 'infocirlceo',
                    type: 'antdesign'
                },
                {
                    title: 'Cài đặt',
                    icon: 'settings',
                    type: "feather",
                    route: 'Setting'
                },
            ],
            infoData4: [
                {
                    title: 'Đăng xuất',
                    icon: 'power-off',
                    type: "font-awesome",
                    route: 'LogOut'
                },
            ],
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.asyncStorageData()
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.props.navigation.push("Lock3", { routeName: this.props.navigation.state.routeName })
                }, timeout);
            }, 500);
        });
        this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
            clearInterval(this.interval);
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
        this.didBlurListener.remove();
        clearInterval(this.interval);
    }

    appSettingData = async () => {
        const storageInfo = await AsyncStorage.getItem('AppSetting')
        const appSetting = JSON.parse(storageInfo)
        return appSetting.timeout
    }

    asyncStorageData = async () => {
        const storageInfo = await AsyncStorage.getItem('UserInfo');
        if (storageInfo) {
            const userInfo = JSON.parse(storageInfo)
            if (userInfo) {
                this.setState({
                    infoData1: [{
                        name: `${userInfo.userName} | ${userInfo.fullName}`,
                        subtitle: userInfo.phoneNumber,
                        img_uri: userInfo.defaultPictureURL,
                        route: "PersonalInfo"
                    }],
                })
            }
        }
    }

    onGotoPersonalInfo = (item, index) => {
        if (item.route)
            this.props.navigation.push(item.route)
    }

    onGotoPartnerConnect = (item, index) => {
        if (item.route)
            this.props.navigation.push(item.route)
    }

    onGotoSetting = (item, index) => {
        if (item.route)
            this.props.navigation.push(item.route)
    }
    onGotoSignOut = (item, index) => {
        Alert.alert(
            'Đăng Xuất',
            'Bạn có muốn kết thúc phiên đăng nhập này không?',
            [
                {
                    text: 'KHÔNG',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'ĐỒNG Ý', onPress: () => this.props.navigation.navigate("ReSignIn")
                },
            ],
            { cancelable: false },
        );
    }

    render() {
        const { infoData1, infoData2, infoData3, infoData4 } = this.state
        return (
            <ScrollView
                contentContainerStyle={styles.container}
            >
                <View>
                    <FlatListComponent
                        data={infoData1}
                        rowItemType="RowItemAvatar"
                        onPress={this.onGotoPersonalInfo}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={infoData2}
                        rowItemType="RowItemIcon"
                        onPress={this.onGotoPartnerConnect}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={infoData3}
                        rowItemType="RowItemIcon"
                        onPress={this.onGotoSetting}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={infoData4}
                        rowItemType="RowItemIcon"
                        onPress={this.onGotoSignOut}
                    />
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#eff1f4',
        paddingHorizontal: 5
    },
});