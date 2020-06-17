import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage'
import { ModalHelp } from '@componentsCommon/modal/ModalHelp';
import { ModalHelpPagination } from '@componentsCommon/modal/ModalHelpPagination';

import { ListItem, Divider } from 'react-native-elements';
import { Container, Tab, Tabs, StyleProvider } from 'native-base';

export default class NoticeCom extends Component {
    static navigationOptions = {
        title: 'Thông Báo'
    }
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.props.navigation.push("Lock2", { routeName: this.props.navigation.state.routeName })
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
        return (

            <Container>
                <Tabs>
                    <Tab heading='Chờ Giao'>
                        <View style={styles.container}>
                            <View style={styles.viewSectionNoList}>
                                <View style={styles.icon}>
                                    <Icon
                                        name='gift'
                                        type='font-awesome'
                                        color='#d82cfd99'
                                        size={120} />
                                </View>
                                <View style={styles.description}>
                                    <Text style={{ color: '#948f8f', fontSize: 20 }}>Bạn chưa có mã quà tặng</Text>
                                </View>
                            </View>
                            <View>
                                <ModalHelpPagination />
                            </View>
                        </View>
                    </Tab>
                    <Tab heading='Đang Giao'>
                        <View style={styles.container}>
                            <View>
                                <ListItem
                                    // key={props.index}
                                    title="Vận đơn: 123456"
                                    subtitle="Khách hàng: Võ Minh Hiếu"
                                    leftIcon={{ name: "resistance", type: "font-awesome" }}
                                    bottomDivider={true}
                                    containerStyle={{ backgroundColor: "#fff" }}
                                    titleStyle={{ fontSize: 18, width: "100%", textAlign: "left", color: "blue" }}
                                    subtitleStyle={{ fontSize: 14, textAlign: "left" }}
                                />
                                <View style={{
                                    height: 80, width: "100%", flexDirection: 'row',
                                    backgroundColor: "#fff",
                                    justifyContent: 'center',
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{
                                        width: '60%', flexDirection: 'column', alignItems: 'flex-start'
                                    }}>
                                        <Text style={{ fontSize: 16, color: 'gray' }}>Địa chỉ</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>532/1/16 Lê Trọng Tấn, Tây Thạnh, Tân Phú, tp Hồ Chí Minh</Text>
                                    </View>
                                    <View style={{
                                        width: '40%', flexDirection: 'column', alignItems: 'flex-end'
                                    }}>
                                        <Text style={{ fontSize: 16, color: 'gray' }}>Thời gian giao</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>16:30 05/05/2020</Text>
                                    </View>
                                </View>
                                <Divider style={{ backgroundColor: 'blue', height: 2 }} />
                            </View>
                            <View>
                                <ListItem
                                    title="Vận đơn: 123458"
                                    subtitle="Khách hàng: Lâm Mai Khanh"
                                    leftIcon={{ name: "resistance", type: "font-awesome" }}
                                    bottomDivider={true}
                                    containerStyle={{ backgroundColor: "#fff" }}
                                    titleStyle={{ fontSize: 18, width: "100%", textAlign: "left", color: "blue" }}
                                    subtitleStyle={{ fontSize: 14, textAlign: "left" }}
                                />
                                <View style={{
                                    height: 80, width: "100%", flexDirection: 'row',
                                    backgroundColor: "#fff",
                                    justifyContent: 'center',
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{
                                        width: '60%', flexDirection: 'column', alignItems: 'flex-start'
                                    }}>
                                        <Text style={{ fontSize: 16, color: 'gray' }}>Địa chỉ</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>567 Lý Thái Tổ, Phường 5, Quận 10, tp Hồ Chí Minh</Text>
                                    </View>
                                    <View style={{
                                        width: '40%', flexDirection: 'column', alignItems: 'flex-end'
                                    }}>
                                        <Text style={{ fontSize: 16, color: 'gray' }}>Thời gian giao</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '500' }}>19:30 05/05/2020</Text>
                                    </View>
                                </View>
                                <Divider style={{ backgroundColor: 'blue', height: 2 }} />
                            </View>
                        </View>
                    </Tab>
                    <Tab heading='Hoàn Thành'>
                        <View style={styles.container}>
                            <View style={styles.viewSectionNoList}>
                            </View>
                            <View>
                                <ModalHelpPagination />
                            </View>
                        </View>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: '#eff1f4',
    },
    viewSectionNoList: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});