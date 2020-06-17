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

export default class Preferential extends Component {
    static navigationOptions = {
        title: 'Ưu đãi'
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
                    {/* <ModalHelp /> */}
                    <ModalHelpPagination />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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