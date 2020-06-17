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
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import HistoryList from '@components/history'

import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

import formatDistance from 'date-fns/formatDistanceToNow'
import isDate from 'date-fns/isDate'
import viLocale from "date-fns/locale/vi";

const numColumns = 3;

class HistoryCom extends Component {
    static navigationOptions = {
        title: "Lịch sử"
    }
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            resultHistory: [],
            isLoading: false,
            isModalAlert: false,
            modalAlert: {
                type: '',
                title: '',
                content: '',
                action: '',
            },
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.setState({ isLoading: true })
            setTimeout(async () => {
                this.loadHistoryByDeliveryUser();
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

    loadHistoryByDeliveryUser = () => {
        const APIHostName = "TMSAPI";
        const APIPath = "api/ShipmentOrder/LoadHistoryByDeliveryUser";
        const APIParams = "68913";
        this.props.callFetchAPI(APIHostName, APIPath, APIParams).then(apiResult => {
            console.log("loadHistoryByDeliveryUser", { apiResult })
            if (apiResult) {
                if (!apiResult.IsError) {
                    const sortHistory = apiResult.ResultObject.sort((a, b) => (a.ShipmentOrderID < b.ShipmentOrderID) ? 1 : -1)
                    const resultHistory = sortHistory.map((item, index) => {
                        const actualDeliveryDuration = formatDistance(new Date(item.ActualBeginDeliveryTime), new Date(item.ActualEndDeliveryTime))
                        item.actualDeliveryDuration = actualDeliveryDuration
                        return item
                    })
                    this.setState({ resultHistory: resultHistory, isLoading: false })
                }
                else {
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            modalAlert: {
                                type: 'error',
                                title: 'Lỗi lấy lịch sử đơn hàng',
                                content: apiResult.MessageDetail,
                            },
                        })
                    }, 100);
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        modalAlert: {
                            type: 'error',
                            title: 'Lỗi hệ thống gọi API đăng nhập',
                            content: 'Vui lòng tắt App và thao tác lại',
                        },
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = () => {
        this.setState({ isLoading: false })
    }

    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true })
    }

    gotoHistoryDetail = (item, index) => {
        // console.log({ item })
        this.props.navigation.navigate('HistoryDetail', { id: item.ShipmentOrderID })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, modalAlert: { type: '', action: '', content: '' } })
    }

    render() {
        const { isLoading, isModalAlert, modalAlert, resultHistory, } = this.state
        return (
            <View style={styles.container}>
                <ModalCenterAlert
                    isCancel={true}
                    isOK={true}
                    isVisible={isModalAlert}
                    typeModal={modalAlert.type}
                    titleModal={modalAlert.title}
                    contentModal={modalAlert.content}
                    onCloseModalAlert={this.onCloseModalAlert}
                />
                <View>
                    <ModalLoading
                        isVisible={isLoading}
                    />
                </View>
                <View style={styles.HistoryList}>
                    <HistoryList
                        result={resultHistory}
                        onSelectDetail={this.gotoHistoryDetail}
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
        }
    };
};

const History = connect(mapStateToProps, mapDispatchToProps)(HistoryCom);
export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
    HistoryList: {
        flex: 1,
        width: '100%',
        marginVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
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