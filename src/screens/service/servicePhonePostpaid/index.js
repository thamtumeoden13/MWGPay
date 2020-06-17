import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextField } from 'react-native-material-textfield';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';

class ServicePhonePostpaidCom extends Component {
    static navigationOptions = {
        title: 'Thanh toán cước trả sau'
    }
    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: '',
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.props.navigation.push("Lock", { routeName: this.props.navigation.state.routeName });
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

    onSubmitInvoice = () => {
        this.props.navigation.navigate('InvoiceInfoPhonePostpaid', {
            PhoneNumber: this.state.phoneNumber,
            PartnerItem: this.props.navigation.state.params.serviceItem
        })
    }

    render() {
        const { phoneNumber } = this.state;
        return (
            <View style={styles.container}>
                <View style={{ height: Math.floor(Dimensions.get('screen').height - 220) }}>
                    <View style={styles.itemPartner}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'flex-start' }}>
                            <ImageBackground
                                source={this.props.navigation.state.params.serviceItem.img_uri}
                                style={{ width: 70, height: 60, paddingLeft: 10, }}
                            />
                        </View>
                        <View style={{ width: Math.floor(Dimensions.get('window').width) - 120, flexDirection: 'column', justifyContent: 'center', alignContent: 'flex-end' }}>
                            <Text>
                                {
                                    this.props.navigation.state.params.serviceItem.name
                                }
                            </Text>
                        </View>
                    </View>

                    <KeyboardAwareScrollView contentContainerStyle={{ width: '95%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginLeft: 'auto', marginRight: 'auto' }}>
                        <TextField
                            label='Số điện thoại liên hệ'
                            inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                            value={phoneNumber}
                            onChangeText={(value) => this.setState({ phoneNumber: value })}
                            clearButtonMode="always"
                            containerStyle={{ width: '100%' }}
                            labelTextStyle={{}}
                            keyboardType='number-pad'
                            prefix=""
                            autoFocus={true}
                        />
                    </KeyboardAwareScrollView>
                </View>
                <ButtonBottomComponent
                    title="Xác nhận hóa đơn"
                    onPress={this.onSubmitInvoice}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        AppInfo: state,
        FetchAPIInfo: state.FetchAPIInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        }
    };
};

const ServicePhonePostpaid = connect(mapStateToProps, mapDispatchToProps)(ServicePhonePostpaidCom);
export default ServicePhonePostpaid;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
    itemPartner: {
        width: '95%',
        height: 70,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
    },
});