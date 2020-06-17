import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Tab, Tabs, StyleProvider } from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';
import { callFetchAPI } from "@actions/fetchAPIAction";

import { TabListOrder, TabDelivering, TabDelivered } from '@components/delivery'

import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class DeliveryCom extends Component {
    static navigationOptions = {
        title: 'Giao Hàng'
    }
    constructor(props) {
        super(props)
        this.state = {
            shipmentOrderList: [],
            shipmentOrderDeliveringList: [],
            shipmentOrderDeliveredList: [],
            isLoading: false,
            isModalAlert: false,
            modalAlert: {
                type: '',
                title: '',
                content: '',
                action: '',
            },
        };
    }

    componentDidMount() {
        this.asyncStorageData();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            // this.setState({ isLoading: true })
            setTimeout(async () => {
                this.loadShipmentOrder();
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false })
                    this.props.navigation.push("Lock", { routeName: this.props.navigation.state.routeName })
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

    asyncStorageData = async () => {
        const storageInfo = await AsyncStorage.getItem('UserInfo')
        if (storageInfo) {
            const userInfo = JSON.parse(storageInfo)
            if (userInfo) {
                this.setState({
                    userName: userInfo.userName,
                })
            }
        }
    }
    loadShipmentOrder = () => {
        this.asyncModalLoadingEnable();
        const APIHostName = "TMSAPI";
        const APIPath = "api/ShipmentOrder/LoadByDeliveryUser";
        const APIParams = this.state.userName;
        this.props.callFetchAPI(APIHostName, APIPath, APIParams).then(apiResult => {
            console.log("shipmentOrderList:", apiResult, APIParams);
            if (apiResult) {
                this.asyncModalLoading();
                if (!apiResult.IsError) {
                    const result = apiResult.ResultObject.filter(e => { return !e.IsCancelDelivery });
                    const shipmentOrderList = result.filter((item, index) => { return item.CurrentShipmentOrderStepID === 1 })
                    const shipmentOrderDeliveringList = result.filter((item, index) => { return item.CurrentShipmentOrderStepID !== 1 && !item.IsCompleteDeliverIed })
                    const shipmentOrderDeliveredList = result.filter((item, index) => { return item.IsCompleteDeliverIed })
                    console.log({ shipmentOrderList, shipmentOrderDeliveringList, shipmentOrderDeliveredList })
                    this.setState({ shipmentOrderList, shipmentOrderDeliveringList, shipmentOrderDeliveredList });
                } else {
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            modalAlert: {
                                type: 'error',
                                title: "Lỗi lấy danh sách đơn hàng ",
                                content: apiResult.MessageDetail,
                            }
                        })
                    }, 100);
                }
            }
            else {
                this.asyncModalLoading(true)
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        modalAlert: {
                            type: 'error',
                            title: "Lỗi hệ thống gọi API đăng nhập ",
                            content: "Vui lòng tắt App và thao tác lại",
                        }
                    })
                }, 100);
            }
        });
    }

    appSettingData = async () => {
        const StorageInfo = await AsyncStorage.getItem('AppSetting')
        const appSetting = JSON.parse(StorageInfo)
        return appSetting.timeout
    }

    handleListOrderDetail = (id) => {
        // console.log({ id })
        // this.props.navigation.navigate('ListOrderDetail', { id: id })
        this.props.navigation.navigate('DeliveringDetail', { id: id })
    }

    handleDeliveringDetail = (id) => {
        // console.log({ id })
        this.props.navigation.navigate('DeliveringDetail', { id: id })
    }

    handleDeliveredDetail = (id) => {
        // console.log({ id })
        this.props.navigation.navigate('DeliveredDetail', { id: id })
    }

    asyncModalLoading = () => {
        this.setState({ isLoading: false })
    }

    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, modalAlert: { type: '', action: '', content: '' } })
    }

    render() {
        const { shipmentOrderList, shipmentOrderDeliveringList, shipmentOrderDeliveredList,
            isLoading, isModalAlert, modalAlert
        } = this.state
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
                <Container>
                    <Tabs locked>
                        <Tab heading='Chờ Giao'>
                            <TabListOrder handleDetail={this.handleListOrderDetail} result={shipmentOrderList} />
                        </Tab>
                        <Tab heading='Đang Giao'>
                            <TabDelivering handleDetail={this.handleDeliveringDetail} result={shipmentOrderDeliveringList} />
                        </Tab>
                        <Tab heading='Hoàn Thành'>
                            <TabDelivered handleDetail={this.handleDeliveredDetail} result={shipmentOrderDeliveredList} />
                        </Tab>
                    </Tabs>
                </Container>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        AuthenticationInfo: state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        callFetchAPI: (hostname, hostURL, postData) => {
            return dispatch(callFetchAPI(hostname, hostURL, postData));
        }
    }
}

const Delivery = connect(mapStateToProps, mapDispatchToProps)(DeliveryCom);
export default Delivery;

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