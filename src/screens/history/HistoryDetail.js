import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { FlatListComponent } from "@componentsCommon/flatList";
import { formatMoney } from '@utils/function';
import { callFetchAPI } from "@actions/fetchAPIAction";

class HistoryDetailCom extends Component {
    static navigationOptions = {
        title: 'Chi tiết giao dịch'
    }

    constructor(props) {
        super(props); this.state = {
            data: [],
            listCard: [],
            total: ''
        }
    }

    componentDidMount() {
        const data = this.props.navigation.getParam('data', []);
        const transactionID = this.props.navigation.getParam('transactionID', '');
        const total = this.props.navigation.getParam('total', '');
        this.setState({ total, data })
        this.callGetServiceTransDetail(transactionID);
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
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

    callGetServiceTransDetail = (transactionID) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/Transaction/LoadServiceTrans";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, transactionID).then(apiResult => {
            if (apiResult && !apiResult.IsError) {
                const listCard = []
                apiResult.ResultObject.CardItemList.map((e, i) => {
                    listCard.push({
                        leftTitle: "Mã Thẻ",
                        rightTitle: e.CardPincode,
                        subTitle: `Serial: ${e.CardSerial}`,
                        writeToClipboard: true
                    })
                })
                this.setState({ listCard })
            }
        });
    }

    render() {
        const { data, total, listCard } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.containerTop}>
                    <Text style={styles.title}>
                        {formatMoney(total, 0)}
                    </Text>
                    <Text style={styles.currency}>
                        VND
                    </Text>
                </View>
                <View style={styles.containerDetail}>
                    <FlatListComponent
                        data={data}
                        rowItemType="RowItemLabel"
                        flatListStyle={{ borderRadius: 5, borderWidth: 1, borderColor: '#827c7ca8', backgroundColor: "#fff" }}
                    />
                </View>
                <View style={styles.containerCardList}>
                    {listCard && listCard.length > 0 &&
                        <FlatListComponent
                            data={listCard}
                            rowItemType="RowItemLabel"
                            flatListStyle={{ borderRadius: 5, borderWidth: 1, borderColor: '#827c7ca8', backgroundColor: "#fff" }}
                            isDivider={true}
                        />
                    }
                </View>
                <View style={styles.containerBottom}>
                    <TouchableOpacity>
                        <Text style={styles.otherBottom}>
                            Bạn cần hỗ trợ?
                        </Text>
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
        }
    };
};

const HistoryDetail = connect(mapStateToProps, mapDispatchToProps)(HistoryDetailCom);
export default HistoryDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    containerTop: {
        // flex: 1,
        height: 100,
        width: "95%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        backgroundColor: '#fff',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#827c7ca8',
    },
    containerDetail: {
        flex: 2,
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: 10
    },
    containerCardList: {
        flex: 3,
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: 10
    },
    containerBottom: {
        height: 50,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        textAlign: 'center',
        // margin: 10,
    },
    currency: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
        paddingTop: 10,
    },
    otherBottom: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: "italic",
        textDecorationLine: "underline"
    }
});