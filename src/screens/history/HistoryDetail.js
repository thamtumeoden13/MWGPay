import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, ListView, FlatList, ImageBackground, ScrollView, Dimensions } from 'react-native'
import { Icon, ListItem, Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import Timeline from 'react-native-timeline-flatlist';

import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterHalf } from "@componentsCommon/modal/ModalCenterHalf";
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { formatMoney } from '@utils/function';

import ItemList from '@components/history/modalInputForm/ItemList'
import CustomerDetail from '@components/history/modalInputForm/CustomerDetail'

class HistoryDetailCom extends Component {
    static navigationOptions = {
        title: "Chi tiết đơn hàng"
    }
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            resultHistory: [],
            isLoading: true,
            currentPage: 0,
            shipmentOrderID: '',
            shipmentOrderInfo: {},
            timeLineDelivery: [],
            timeLineStatus: [
                { time: '09:00', title: 'Chờ giao', description: '', },
                { time: '10:45', title: 'Bắt đầu đi giao', description: '' },
                { time: '12:00', title: 'Đến nhà khách' },
                { time: '14:00', title: 'Đã giao', description: '' },
            ],
            isModalInputForm: false,
            typeModalInputForm: 0,
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
        const shipmentOrderID = this.props.navigation.getParam('id', '');
        this.setState({ shipmentOrderID })
        this.loadShipmentOrderDetail(shipmentOrderID);
        this.asyncStorageData();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false, isModalInputForm: false })
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

    renderPage = rowData => {
        const item = rowData.item
        return (
            <View style={styles.rowItem}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
            </View>
        )
    }

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        const visibleItemsCount = viewableItems.length
        if (visibleItemsCount != 0) {
            this.setState({ currentPage: viewableItems[visibleItemsCount - 1].index })
        }
    }

    onViewableItem = (data) => {
        this.setState({ isModalInputForm: true, typeModalInputForm: 1 })

    }

    loadShipmentOrderDetail = (id) => {
        this.asyncModalLoadingEnable()
        const APIHostName = "TMSAPI";
        const APIPath = "api/ShipmentOrder/LoadInfoForMobile";
        const APIParams = id;
        this.props.callFetchAPI(APIHostName, APIPath, APIParams).then(apiResult => {
            console.log("loadShipmentOrderDetail:", apiResult);
            if (apiResult) {
                this.asyncModalLoading();
                if (!apiResult.IsError) {
                    const shipmentOrderInfo = apiResult.ResultObject;
                    this.setState({ shipmentOrderInfo });
                    const timeStart = `${new Date(shipmentOrderInfo.ShipmentOrder_WorkFlowList[0].ProcessDate).getHours()}:${new Date(shipmentOrderInfo.ShipmentOrder_WorkFlowList[0].ProcessDate).getMinutes()}`
                    const timeEnd = `${new Date(shipmentOrderInfo.ShipmentOrder_WorkFlowList[shipmentOrderInfo.ShipmentOrder_WorkFlowList.length - 1].ProcessDate).getHours()}:${new Date(shipmentOrderInfo.ShipmentOrder_WorkFlowList[shipmentOrderInfo.ShipmentOrder_WorkFlowList.length - 1].ProcessDate).getMinutes()}`
                    const timeLineDelivery = [
                        {
                            time: timeStart,
                            title: shipmentOrderInfo.SenderStoreName,
                            description: shipmentOrderInfo.SenderFullName,
                            icon: <Icon type="material" name="my-location" size={24} color="#000" />,
                            shipmentOrderInfo: shipmentOrderInfo
                        },
                        {
                            time: timeEnd,
                            title: shipmentOrderInfo.ReceiverFullName,
                            description: shipmentOrderInfo.ReceiverFullAddress,
                            icon: <Icon type="material" name="location-on" size={24} color="#000" />
                        }
                    ]
                    let timeLineStatus = this.state.timeLineStatus
                    if (shipmentOrderInfo.ShipmentOrder_WorkFlowList) {
                        const shipmentOrder_WorkFlowList = shipmentOrderInfo.ShipmentOrder_WorkFlowList.sort((a, b) => (a.ShipmentOrderStepID > b.ShipmentOrderStepID) ? 1 : -1)
                        timeLineStatus = shipmentOrder_WorkFlowList.map((item, index) => {
                            const timeProcess = `${new Date(item.ProcessDate).getHours()}:${new Date(item.ProcessDate).getMinutes()}`
                            return {
                                time: timeProcess,
                                title: item.ShipmentOrderStepName,
                                description: item.Note
                            }
                        })
                        // timeLineStatus[0].description = 'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. '
                        timeLineStatus[0].circleColor = '#009688'
                        timeLineStatus[0].lineColor = '#009688'

                        // timeLineStatus[timeLineStatus.length - 1].description = 'Team sport played between two teams of eleven players with a spherical ball. Team sport played between two teams of eleven players with a spherical ball.Team sport played between two teams of eleven players with a spherical ball.'
                        timeLineStatus[timeLineStatus.length - 1].circleColor = '#009688'
                        timeLineStatus[timeLineStatus.length - 1].lineColor = '#009688'
                    }

                    this.setState({ timeLineDelivery, timeLineStatus })
                } else {
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            modalAlert: {
                                type: 'error',
                                title: 'Lỗi lấy chi tiết đơn hàng',
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

    asyncModalLoading = (isReloadData) => {
        this.setState({ isLoading: false })
        if (isReloadData)
            setTimeout(() => {
                this.loadShipmentOrderDetail(this.state.shipmentOrderID)
            }, 500);
    }

    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true })
    }

    showDetailItemList = () => {
        this.setState({ isModalInputForm: true, typeModalInputForm: 0 })
    }

    renderModalInputForm = (typeModalInputForm) => {
        const { shipmentOrderInfo } = this.state
        if (typeModalInputForm == 0) {
            return (
                <ItemList
                    shipmentOrderInfo={shipmentOrderInfo}
                />
            )
        }
        if (typeModalInputForm == 1) {
            return (
                <CustomerDetail
                    shipmentOrderInfo={shipmentOrderInfo}
                />
            )
        }
    }

    onCloseModalAlert = () => {
        this.setState({
            isModalAlert: false,
            modalAlert: { type: '', content: '' },
        })
    }

    OnCloseModal = () => {
        this.setState({ isModalInputForm: false, typeModalInputForm: 0 })
    }

    render() {
        const { isLoading, isModalAlert, modalAlert, shipmentOrderID,
            timeLineStatus, timeLineDelivery,
            isModalInputForm, typeModalInputForm
        } = this.state

        const { PrimaryShipItemName, TotalItems, TotalCOD } = this.state.shipmentOrderInfo

        return (
            <Fragment>
                <ModalCenterHalf
                    isVisible={isModalInputForm}
                    content={this.renderModalInputForm(typeModalInputForm)}
                    onClose={this.OnCloseModal}
                />
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
                <View style={styles.container}>
                    <View style={{ height: 145, width: '98%', flexDirection: 'column', marginTop: 5, borderRadius: 5, backgroundColor: '#93d5f6', marginHorizontal: '1%' }}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ width: '25%', paddingLeft: 10 }}>
                                <ImageBackground
                                    resizeMode='contain'
                                    source={{
                                        uri: 'https://cdn.tgdd.vn/Products/Images/2002/217755/toshiba-ras-h10d2kcvg-v-1-1-org.jpg'
                                    }}
                                    resizeMode='contain'
                                    style={{ width: '95%', height: 80, justifyContent: 'center', }}
                                />
                            </View>
                            <View style={{ width: '75%' }}>
                                <ListItem
                                    title={PrimaryShipItemName}
                                    subtitle={
                                        <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, textAlign: 'right', color: 'green' }}>{"#"}{shipmentOrderID}</Text>
                                            <Text style={{ fontSize: 14, textAlign: 'right', color: 'green' }}>Chi tiết...</Text>
                                        </View>
                                    }
                                    onPress={() => this.showDetailItemList()}
                                    containerStyle={{ backgroundColor: '#93d5f6', width: '100%', borderTopRightRadius: 5 }}
                                    titleStyle={{ fontSize: 16, width: "100%", textAlign: "left", color: "#000", fontWeight: '600', marginVertical: 5, paddingTop: 10 }}
                                />
                            </View>
                        </View>
                        <View style={{
                            height: 60,
                            maxHeight: 120,
                            width: "96%",
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            paddingBottom: 5,
                            marginTop: 10,
                            borderTopColor: '#fff',
                            borderTopWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginHorizontal: '2%'
                        }}>
                            <View style={{
                                width: '20%', flexDirection: 'column', alignItems: 'flex-start',
                            }}>
                                <Text style={{ fontSize: 14, color: 'green', marginBottom: 5 }}>Số kiện</Text>
                                <Text style={{ fontSize: 16, fontWeight: '500', paddingLeft: 10, color: '#000' }} >{TotalItems}</Text>
                            </View>
                            <View style={{
                                width: '40%', flexDirection: 'column', alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: 14, color: 'green', marginBottom: 5 }}>Tiền COD</Text>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }}>{TotalCOD ? formatMoney(TotalCOD, 0) : 0}</Text>
                            </View>
                            <View style={{
                                width: '40%', flexDirection: 'column', alignItems: 'flex-end'
                            }}>
                                <Text style={{ fontSize: 14, color: 'green', marginBottom: 5 }}>Vật tư lắp đặt</Text>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }}>{TotalItems}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 240, width: '98%', flexDirection: 'column', marginTop: 5, borderRadius: 5, backgroundColor: '#93d5f6', marginHorizontal: '1%' }}>
                        <ScrollView contentContainerStyle={{ flex: 1, width: '100%' }}>
                            <Timeline
                                style={{ flex: 1, marginTop: 5, marginHorizontal: 10 }}
                                data={timeLineDelivery}
                                circleSize={25}
                                dotSize={13}
                                circleColor='#fff'
                                lineColor='gray'
                                descriptionStyle={{ color: 'gray' }}
                                timeContainerStyle={{ minWidth: 52, marginTop: 5 }}
                                timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
                                descriptionStyle={{ color: 'gray' }}
                                options={{ style: { paddingTop: 5 } }}
                                innerCircle={'icon'}
                                onEventPress={data => this.onViewableItem(data)}
                            />
                            <View style={{
                                height: 48,
                                width: '100%',
                                flexDirection: 'column',
                                marginVertical: 'auto',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Divider style={{ backgroundColor: '#909090', height: 2, width: '90%' }} />
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-around', width: '70%' }}>
                                    <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'center', }}>
                                        <Icon name='av-timer' type='material' color='#000' size={20} />
                                        <Text>30km</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'center', }}>
                                        <Icon name='av-timer' type='material' color='#000' size={20} />
                                        <Text>39 phút</Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{
                        height: Dimensions.get('window').height - 500, width: '98%', flexDirection: 'column',
                        marginTop: 5, marginBottom: 10,
                        borderRadius: 5, backgroundColor: '#fff', marginHorizontal: '1%'
                    }}>
                        <ScrollView contentContainerStyle={{ flex: 1, width: '100%', paddingBottom: 10 }} scrollEnabled={true} >
                            <Timeline
                                style={{ flex: 1, marginTop: 5, marginBottom: 10, marginHorizontal: 10 }}
                                data={timeLineStatus}
                                circleSize={25}
                                dotSize={13}
                                circleColor='rgb(45,156,219)'
                                lineColor='rgb(45,156,219)'
                                timeContainerStyle={{ minWidth: 52, marginTop: 5 }}
                                timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
                                descriptionStyle={{ color: 'gray' }}
                                options={{ style: { paddingTop: 5 } }}
                                innerCircle={'dot'}
                            />
                        </ScrollView>
                    </View>
                </View>
            </Fragment>
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
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
    },
    stepIndicator: {
        marginVertical: 50,
        paddingHorizontal: 20
    },
    rowItem: {
        flex: 3,
        paddingVertical: 20
    },
    title: {
        flex: 1,
        fontSize: 20,
        color: '#333333',
        paddingVertical: 16,
        fontWeight: '600'
    },
    body: {
        flex: 1,
        fontSize: 15,
        color: '#606060',
        lineHeight: 24,
        marginRight: 8
    }
})