
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Alert } from 'react-native'
import { SearchBar, Input, Icon } from 'react-native-elements';

import { formatMoney } from '@utils/function';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";

class ContentCom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hasConnectedBank: false,
            disabled: true
        }
    }

    componentDidMount = () => {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getBankAccount();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }
    getBankAccount = () => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/BankAccount/ListByWalletID";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, "").then(apiResult => {
            if (!apiResult) {
                this.setState({ hasConnectedBank: false, disabled: false })
                return;
            }
            if (apiResult.IsError) {
                this.setState({ hasConnectedBank: false, disabled: false })
                return;
            }
            if (apiResult.ResultObject.length > 0) {
                this.setState({ hasConnectedBank: true, disabled: false })
            }
            else {
                this.setState({ hasConnectedBank: false, disabled: false })
            }
        });
    }
    render() {
        const currentAmount = this.props.AppInfo.AccountBalance.CurrentAccountBalance;
        const totalAmount = formatMoney(currentAmount, 0);
        const navigation = this.props.navigation;
        const { hasConnectedBank, disabled } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('QRCodeScannerScreen')}>
                        <View style={styles.contentIcon}>
                            <Icon
                                name="qrcode"
                                type="antdesign"
                                color="#f7efef"
                                size={20}
                            />
                        </View>
                        <View style={styles.contentTitle}>
                            <Text style={{ color: '#f7efef', fontSize: 12, textAlign: 'center' }} >THANH TOÁN</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => navigation.navigate("Wallet")}>
                        <View style={styles.contentIcon}>
                            <Text style={{ color: '#f7efef', fontSize: 10, textAlign: 'center' }}>Số dư</Text>
                            <Text style={{ color: '#f7efef', fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>VND</Text>
                        </View>
                        <View style={styles.contentTitle}>
                            <Text style={{ color: '#f7efef', fontSize: 16, textAlign: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', }} >{totalAmount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => navigation.navigate("TopUp", { hasConnectedBank: hasConnectedBank })} disabled={disabled}>
                        <View style={styles.contentIcon}>
                            <Icon
                                name="indent-right"
                                type="antdesign"
                                color="#f7efef"
                                size={20}
                            />
                        </View>
                        <View style={styles.contentTitle}>
                            <Text style={{ color: '#f7efef', fontSize: 12, textAlign: 'center' }} >NẠP TIỀN</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
        },

    };
};

const Content = connect(mapStateToProps, mapDispatchToProps)(ContentCom);
export default Content;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    containerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%',
        alignContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
    },
    contentIcon: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#f7efef',
        borderWidth: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    contentTitle: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
})