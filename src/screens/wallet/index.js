import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { TopInfo, MiddleImage, BottomFunctionItem } from '@components/wallet';
import { FlatListComponent } from '@componentsCommon/flatList';
import { formatMoney } from '@utils/function';
import { updateAccountBalance } from "@actions/walletAction";

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";

const data = [
    {
        key: 1,
        title: 'Nạp tiền',
        subtitle: 'Từ ngân hàng vào MWGPay',
        icon: 'user',
        type: 'font-awesome',
        color: 'green',
        size: 20,
        route: "TopUp"
    },
    {
        key: 2,
        title: 'Rút tiền',
        subtitle: 'Từ MWGPay về ngân hàng',
        icon: 'user',
        type: 'font-awesome',
        color: 'green',
        size: 20,
        route: "CashOut"
    },
    {
        key: 3,
        title: 'Chuyển tiền',
        subtitle: 'Từ MWGPay đến bạn bè, người thân',
        icon: 'user',
        type: 'font-awesome',
        color: 'green',
        size: 20,
        route: ""
    }
]

class WalletCom extends Component {
    static navigationOptions = {
        title: 'Số dư TK MWGPay',
        tabBarVisible: false,
    }
    constructor(props) {
        super(props);
        this.onPressItem = this.onPressItem.bind(this)
        this.state = {
            hasConnectedBank: false,
            currentBalance: this.props.AppInfo.AccountBalance.CurrentAccountBalance,
            disabled: true
        }
    }

    componentDidMount = () => {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getBankAccount();
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
    _keyExtractor = (item) => item.key.toString();

    onPressItem = (item) => {
        const { hasConnectedBank, disabled } = this.state
        if (!disabled) {
            this.props.navigation.navigate(item.route, { hasConnectedBank: hasConnectedBank });
        }
    }

    render() {
        const { currentBalance } = this.state
        return (
            <View style={styles.container}>
                <TopInfo currentAmount={formatMoney(currentBalance, 0)} />
                <MiddleImage />
                <View style={styles.bottomFunction}>
                    <FlatListComponent
                        data={data}
                        // extraData={hasConnectedBank}
                        rowItemType="RowItemIcon"
                        onPress={this.onPressItem}
                    />
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
        updateAccountBalance: (accountBalance) => {
            return dispatch(updateAccountBalance(accountBalance))
        },
    };
};

const Wallet = connect(mapStateToProps, mapDispatchToProps)(WalletCom);
export default Wallet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    bottomFunction: {
        flex: 4,
        width: "100%",
        marginTop: 10,
    }
});