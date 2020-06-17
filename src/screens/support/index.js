import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import { FlatListComponent } from '@componentsCommon/flatList'

export default class SupportCenter extends Component {
    static navigationOptions = {
        title: 'Trung tâm hỗ trợ'
    }
    constructor(props) {
        super(props);
        this.state = {
            infoData1: [
                {
                    title: 'Chương trình khuyến mãi',
                    subtitle: "Gửi các yêu cầu hỗ trợ về CTKM",
                    icon: 'resistance',
                    type: "font-awesome"
                },
                {
                    title: 'Thanh toán dịch vụ',
                    subtitle: "gửi hỗ trợ liên quan đến thanh toán dịch vụ",
                    icon: 'cart-plus',
                    type: "font-awesome"
                },
            ],
            infoData2: [
                {
                    title: 'Hộp thư yêu cầu',
                    icon: 'slideshare',
                    type: "font-awesome"
                },
                {
                    title: 'Liên lạc tổng đài',
                    subtitle: "1000đ/phút",
                    icon: 'whatsapp',
                    type: "font-awesome"
                },
                {
                    title: 'Lỗi thanh toán tại quầy',
                    icon: 'barcode',
                    type: "font-awesome"
                },
            ],
            infoData3: [
                {
                    title: 'Thông tin cơ bản',
                    subtitle: "dành cho người mới bắt đầu",
                    icon: 'superpowers',
                    type: 'font-awesome',
                },
                {
                    title: 'Quản lý úng dụng và tài khoản',
                    subtitle: "Xác thưc tk, cài đặt và mật khẩu",
                    icon: 'address-book',
                    type: 'font-awesome'
                },
                {
                    title: 'Nạp, rút tiền',
                    subtitle: "Qua tài khoản ngân hàng & Điểm nạp/rút",
                    icon: 'exchange',
                    type: 'font-awesome'
                },
                {
                    title: 'An toàn bảo mật',
                    subtitle: "Chính sách và công nghẹ bảo mật",
                    icon: 'shield',
                    type: 'font-awesome'
                },
                {
                    title: 'Tất cả chủ đề',
                    subtitle: "Xem tất cả các chủ đề tại đây",
                    icon: 'ellipsis-h',
                    type: 'font-awesome'
                },
            ],
        };
    }

    componentDidMount = () => {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
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

    render() {
        const { infoData1, infoData2, infoData3 } = this.state
        return (
            <ScrollView
                contentContainerStyle={styles.container}
            >
                <View>
                    <FlatListComponent
                        data={infoData1}
                        rowItemType="RowItemIcon"
                        headerTitle="BẠN CẦN HỖ TRỢ VỀ VẤN ĐỀ"
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={infoData2}
                        rowItemType="RowItemIcon"
                        headerTitle="QUẢN LÝ HỘP THƯ YÊU CẦU"
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={infoData3}
                        rowItemType="RowItemIcon"
                        headerTitle="HƯỚNG DẪN THEO CHỦ ĐỀ"
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