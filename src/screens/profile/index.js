import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import { FlatListComponent } from '@componentsCommon/flatList'
import ProfileAccAuth from '@components/profile/ProfileAccAuth'

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
                    title: 'Thành viên chuẩn',
                    subtitle: "Còn 100 điểm để trở thành Thành viên Bạc",
                    icon: 'dingding',
                    type: "antdesign"
                },
                {
                    title: 'Chia sẻ bạn bè',
                    subtitle: "Mã của bạn: 0971196061",
                    icon: 'share',
                    type: "foundation"
                },
            ],
            infoData3: [
                {
                    title: 'Quản lý thẻ/tài khoản',
                    subtitle: "2 thẻ/tài khoản",
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
                    title: 'Quản lý nhóm bạn bè',
                    icon: 'group',
                    type: 'material'
                },
            ],
            infoData4: [
                {
                    title: 'Trung Tâm Hỗ Trợ',
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
            enableScrollViewScroll: true,
            isVerifiedEmail: false,
            isUpdatedPersonalInfo: false,
            isVerifiedWalletAccount: false,
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.storeData()
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
        const StorageInfo = await AsyncStorage.getItem('AppSetting')
        const appSetting = JSON.parse(StorageInfo)
        return appSetting.timeout
    }

    storeData = async () => {
        let infoData3 = this.state.infoData3;
        const StorageInfo = await AsyncStorage.getItem('UserInfo');
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                const img_uri = `data:image/jpeg;base64,${userInfo.avatarImage}`
                this.setState({
                    infoData1: [{
                        name: userInfo.fullName,
                        subtitle: userInfo.phoneNumber,
                        img_uri: img_uri,
                        route: "PersonalInfo"
                    }],
                    infoData3: [
                        {
                            title: 'Quản lý thẻ/tài khoản',
                            subtitle: `${userInfo.totalAccountList} thẻ/tài khoản`,
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
                            title: 'Quản lý nhóm bạn bè',
                            icon: 'group',
                            type: 'material'
                        },
                    ],
                    isVerifiedEmail: userInfo.isVerifiedEmail,
                    isUpdatedPersonalInfo: userInfo.isUpdatedPersonalInfo,
                    isVerifiedWalletAccount: userInfo.isVerifiedWalletAccount,
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
    onPreAccAuth = () => {
        this.props.navigation.navigate('PreAccAuth')
    }
    render() {
        const { infoData1, infoData2, infoData3, infoData4,
            isVerifiedEmail, isUpdatedPersonalInfo, isVerifiedWalletAccount } = this.state
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
                {(!isVerifiedEmail || !isUpdatedPersonalInfo || !isVerifiedWalletAccount) &&
                    <ProfileAccAuth
                        isVerifiedEmail={isVerifiedEmail}
                        isUpdatedPersonalInfo={isUpdatedPersonalInfo}
                        isVerifiedWalletAccount={isVerifiedWalletAccount}
                        onPreAccAuth={this.onPreAccAuth}
                    />
                }
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={infoData2}
                        rowItemType="RowItemIcon"
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={infoData3}
                        rowItemType="RowItemIcon"
                        onPress={this.onGotoPartnerConnect}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={infoData4}
                        rowItemType="RowItemIcon"
                        onPress={this.onGotoSetting}
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
    containerSecurity: {
        width: '100%',
        height: 200,
        borderWidth: 1,
        backgroundColor: "#f1e3bc8c",
        borderColor: '#d2a1188c',
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 10,
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    containerTop: { flex: 1, width: '100%' },
    containerMiddle: { flex: 2, width: '100%', flexDirection: 'row', flexWrap: 'wrap' },
    containerMiddleLeft: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    containerMiddleLeftCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 30,
        borderWidth: 5,
        borderColor: 'gray'
    },
    containerMiddleLeftCircleText: { color: 'black', fontSize: 20, color: 'green' },
    containerMiddleRight: { flex: 4 },
    containerMiddleRightText: { fontSize: 14, textAlign: "left" },
    containerBottom: { flex: 3, width: '100%', flexDirection: 'row', flexWrap: 'wrap' },
    containerBottomLeft: { flex: 2, justifyContent: 'space-around' },
    containerBottomRight: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});