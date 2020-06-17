import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    ActivityIndicator,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { HistoryItem } from '@components/history/HistoryItem';
import { formatMoney } from '@utils/function';

class HistoryCom extends Component {
    static navigationOptions = {
        title: "Lịch sử"
    }
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            resultHistory: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            const InitSearchParams = "";
            this.setState({ isLoading: true })
            setTimeout(async () => {
                this.callSearchData(InitSearchParams);
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false })
                    this.props.navigation.push("Lock1", { routeName: this.props.navigation.state.routeName })
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

    callSearchData(searchData) {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Wallet/LoadCashflow";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, searchData).then(apiResult => {
            if (apiResult && !apiResult.IsError) {
                const sortTemp = apiResult.ResultObject.sort((a, b) => (a.TransactionDate < b.TransactionDate) ? 1 : (a.TransactionDate === b.TransactionDate) ? ((a.TransactionID > b.TransactionID) ? 1 : -1) : -1)
                const resultHistory = []
                let elementResult = {}
                let currentYear = 0
                let currentMonth = 0
                sortTemp.map((e, i) => {
                    const transactionDate = new Date(e.TransactionDate)
                    if (currentYear != transactionDate.getFullYear()
                        || currentMonth != transactionDate.getMonth() + 1) {
                        resultHistory.push(elementResult)
                        elementResult = {
                            year: transactionDate.getFullYear(),
                            month: transactionDate.getMonth() + 1,
                            data: [{
                                serviceID: e.ServiceID,
                                transactionID: e.TransactionID,
                                transactionTypeID: e.TransactionTypeID,
                                transactionTypeName: e.TransactionTypeName,
                                transactionContent: e.TransactionContent,
                                transactionDate: e.TransactionDate,
                                amount: e.Amount,
                                isIncomeCashflow: e.IsIncomeCashflow,
                                cashflowTypeName: e.CashflowTypeName,
                                cashflowContent: e.CashflowContent
                            }]
                        }
                        currentYear = transactionDate.getFullYear()
                        currentMonth = transactionDate.getMonth() + 1
                    }
                    else {
                        elementResult.data.push({
                            serviceID: e.ServiceID,
                            transactionID: e.TransactionID,
                            transactionTypeID: e.TransactionTypeID,
                            transactionTypeName: e.TransactionTypeName,
                            transactionContent: e.TransactionContent,
                            transactionDate: e.TransactionDate,
                            amount: e.Amount,
                            isIncomeCashflow: e.IsIncomeCashflow,
                            cashflowTypeName: e.CashflowTypeName,
                            cashflowContent: e.CashflowContent
                        })
                    }
                })
                resultHistory.push(elementResult)
                resultHistory.shift();
                this.setState({ resultHistory, isLoading: false })
            }
        });
    }

    renderSectionHeader = ({ section }) => {
        return (
            <View style={styles.SectionListHeader}>
                <Text style={styles.SectionListHeaderText}>
                    Tháng {section.month < 10 ? '0' + section.month : section.month}/{section.year}
                </Text>
            </View>
        )
    }

    renderItem = ({ section, item }) => {
        return (
            <HistoryItem
                section={section}
                item={item}
                onPress={this.gotoHistoryDetail}
            />
        )
    }

    keyExtractor = (item, index) => index.toString();

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 2,
                    width: '100%',
                    backgroundColor: '#CED0CE'
                }}
            />
        );
    }

    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    }

    handleLoadMore = () => {
        // if (!this.state.loading) {
        //     this.page = this.page + 1; // increase page by 1
        //     this.fetchUser(this.page); // method for API call 
        // }
    };

    gotoHistoryDetail = (item) => {
        const date = new Date(item.transactionDate)
        const day = parseInt(date.getDate()) > 9 ? date.getDate().toString() : '0' + date.getDate().toString()
        const month = parseInt(date.getMonth() + 1) > 9 ? parseInt(date.getMonth() + 1).toString() : '0' + parseInt(date.getMonth() + 1).toString()
        const hours = parseInt(date.getHours()) > 9 ? date.getHours().toString() : '0' + date.getHours().toString()
        const minutes = parseInt(date.getMinutes()) > 9 ? date.getMinutes().toString() : '0' + date.getMinutes().toString()
        const exchangeTime = day + "/" + month + " " + hours + ":" + minutes
        const dataDetail = [
            {
                leftTitle: "Loại dịch vụ",
                rightTitle: item.cashflowContent //item.transactionContent
            },
            {
                leftTitle: "Số tiền",
                rightTitle: formatMoney(item.amount, 0)
            },
            {
                leftTitle: "Thời gian",
                rightTitle: exchangeTime
            },
            {
                leftTitle: "Mã giao dịch",
                rightTitle: item.transactionID
            },
        ]
        this.props.navigation.navigate('HistoryDetail', {
            data: dataDetail,
            total: item.amount,
            transactionID: item.transactionID
        })
    }

    updateSearch = search => {
        this.setState({ search });
    };

    render() {
        const { isLoading, resultHistory } = this.state
        return (
            <View style={styles.container}>
                {
                    isLoading
                        ?
                        <ImageBackground style={{ width: 60, height: 60, justifyContent: 'center', alignContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                            resizeMode='contain'
                            source={require('@assets/bg/loading.gif')}
                        ></ImageBackground>
                        :
                        <View style={styles.viewSectionList}>
                            {resultHistory && resultHistory.length > 0 ?
                                <SectionList
                                    style={{ backgroundColor: '#eff1f4' }}
                                    sections={resultHistory}
                                    extraData={resultHistory}
                                    keyExtractor={this.keyExtractor}
                                    renderSectionHeader={this.renderSectionHeader}
                                    renderItem={this.renderItem}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    ListFooterComponent={this.renderFooter}
                                    onEndReachedThreshold={0.4}
                                    onEndReached={this.handleLoadMore}
                                />
                                :
                                <View style={styles.viewSectionNoList}>
                                    <View style={styles.icon}>
                                        <Icon
                                            name='exclamation'
                                            type='font-awesome'
                                            color='#948f8f'
                                            containerStyle={{ backgroundColor: '#fff', height: 80, width: 80, borderColor: '#80808069', borderWidth: 1, borderRadius: 40, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}
                                            size={40} />
                                    </View>
                                    <View style={styles.description}>
                                        <Text style={{ color: '#948f8f', fontSize: 20 }}>Bạn chưa có lịch sử giao dịch</Text>
                                    </View>
                                </View>
                            }
                        </View>
                }
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

const History = connect(mapStateToProps, mapDispatchToProps)(HistoryCom);
export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eff1f4',
    },
    SectionListHeader: {
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: '#64B5F6',
    },
    SectionListHeaderText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginHorizontal: 5
    },
    viewSectionList: {
        flex: 1,
        width: '100%',
    },
    viewSectionNoList: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',

    },
    icon: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 100,
    },
    description: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
    },
});