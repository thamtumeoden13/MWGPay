import React, { Fragment } from 'react'
import {
    Alert, View, Text, StyleSheet, StatusBar, UIManager, ScrollView,
    Linking, Platform, Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { callFetchAPI } from "@actions/fetchAPIAction";
import AsyncStorage from '@react-native-community/async-storage';

import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ModalCenterHalf } from "@componentsCommon/modal/ModalCenterHalf";

import { DeliveredDetail as Detail } from '@components/delivery/delivered/DeliveredDetail'
import { GetBarcode } from '@components/delivery/delivered/modalInputForm/GetBarCode'


// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

class DeliveredDetailCom extends React.Component {
    static navigationOptions = {
        title: 'Chi tiết đơn hàng hoàn thành',
        gesturesEnabled: false
    }

    constructor(props) {
        super(props)
        this.state = {
            isGoBack: false,
            isLoading: false,
            isModalAlert: false,
            modalAlert: {
                type: '',
                title: '',
                content: '',
                action: '',
            },
            shipmentOrderInfo: {},
            shipmentOrderID: '',
            note: '',
            isModalInputForm: false,
            typeModalInputForm: 0,
            materialList: []
        }
    }

    componentDidMount() {
        this.asyncModalLoadingEnable();
        const shipmentOrderID = this.props.navigation.getParam('id', '');
        this.setState({ shipmentOrderID })
        setTimeout(() => {
            this.loadShipmentOrderDetail(shipmentOrderID);
        }, 50)
        this.asyncStorageData();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false, isModalInputForm: false })
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

    appSettingData = async () => {
        const StorageInfo = await AsyncStorage.getItem('AppSetting')
        const appSetting = JSON.parse(StorageInfo)
        return appSetting.timeout
    }

    asyncModalLoading = (isReloadData = false, isGoBack = false) => {
        this.setState({ isLoading: false })
        // console.log("isGoBack asyncModalLoading", this.state.isGoBack, isGoBack)
        this.setState({ isGoBack: isGoBack })
    }

    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true })
    }

    _handleOpenURL(event) {
        console.log("_handleOpenURL", event.url);
    }

    loadShipmentOrderDetail = (id) => {
        const APIHostName = "TMSAPI";
        const APIPath = "api/ShipmentOrder/LoadInfoForMobile";
        const APIParams = id;
        this.props.callFetchAPI(APIHostName, APIPath, APIParams).then(apiResult => {
            console.log("loadShipmentOrderDetail:", apiResult);
            this.asyncModalLoading();
            if (apiResult) {
                if (!apiResult.IsError) {
                    this.setState({ shipmentOrderInfo: apiResult.ResultObject });
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
                this.asyncModalLoading(false, true)
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

    onCloseModalAlert = (value) => {
        this.setState({
            isModalAlert: false,
            modalAlert: { type: '', content: '' },
        })
        if (this.state.isGoBack) {
            this.props.navigation.goBack();
        }
    }

    onCloseModalInputForm = () => {
        this.setState({ isModalInputForm: false, typeModalInputForm: 0, })
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

    renderModalInputForm = (typeModalInputForm) => {
        const { shipmentOrderInfo, shipmentOrderID } = this.state
        return (
            <GetBarcode
                onCloseModalInputForm={this.onCloseModalInputForm}
                shipmentOrderInfo={shipmentOrderInfo}
                shipmentOrderID={shipmentOrderID}
            />
        )
    }

    receiveMoney = () => {
        this.onCloseModalInputForm()
        setTimeout(() => {
            this.asyncModalLoadingEnable()
        }, 200);
        setTimeout(() => {
            this.collectMoney()
        }, 500);
    }

    preGetBarCode = () => {
        this.setState({ isModalInputForm: true, typeModalInputForm: 0 })
    }

    collectMoney = () => {
        const { shipmentOrderID, userName, materialList, shipmentOrderInfo } = this.state

        let collectionList = [{
            "PaymentMethodID": 1,
            "IsCODCollection": true,
            "CollectedMoney": shipmentOrderInfo.TotalCOD,
            "CollectedVoucherID": "",
            "CollectedUser": userName,
            "Note": ""
        }]
        if (materialList.length > 0) {
            const totalCODMaterial = materialList.reduce((sum, curValue, curIndex, []) => {
                const totalPrice = curValue.SaleQuantity * curValue.Price
                sum += totalPrice
                return sum
            }, 0);
            collectionList.push({
                "PaymentMethodID": 1,
                "IsCODCollection": false,
                "CollectedMoney": totalCODMaterial,
                "CollectedVoucherID": "",
                "CollectedUser": userName,
                "Note": ""
            })
        }

        const APIHostName = "TMSAPI";
        const APIPath = "api/ShipmentOrder/CollectMoney";
        const APIParams = {
            "ShipmentOrderID": shipmentOrderID,
            "CollectionList": collectionList
        }
        this.props.callFetchAPI(APIHostName, APIPath, APIParams).then(apiResult => {
            // console.log("receiveMoney:", apiResult);
            if (apiResult) {
                if (!apiResult.IsError) {
                    this.asyncModalLoading(true);
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            modalAlert: {
                                type: 'success',
                                title: "Thu tiền",
                                content: "Thành công",
                            },
                        })
                    }, 100);
                } else {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            modalAlert: {
                                type: 'error',
                                title: "Lỗi Thu tiền ",
                                content: apiResult.MessageDetail,
                            },
                        })
                    }, 100);
                }
            }
            else {
                this.asyncModalLoading(false, true)
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        modalAlert: {
                            type: 'error',
                            title: "Lỗi hệ thống gọi API đăng nhập",
                            content: "Vui lòng tắt App và thao tác lại",
                        },
                    })
                }, 100);
            }
        });
    }

    render() {
        const {
            shipmentOrderInfo,
            isLoading,
            isModalAlert,
            modalAlert,
            img_uri,
            isModalInputForm,
            typeModalInputForm
        } = this.state


        return (
            <Fragment>
                <ModalCenterHalf
                    isVisible={isModalInputForm}
                    content={this.renderModalInputForm(typeModalInputForm)}
                    onClose={this.onCloseModalInputForm}
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
                <View style={styles.containerDetail}>
                    <Detail
                        shipmentOrderInfo={shipmentOrderInfo}
                        img_uri={img_uri}
                    />
                    <ButtonBottomComponent
                        title="Lấy Barcode Thu tiền"
                        onPress={this.preGetBarCode}
                        containerButtonGroup={styles.containerButtonGroup}
                    />
                </View>
            </Fragment>
        )
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

const DeliveredDetail = connect(mapStateToProps, mapDispatchToProps)(DeliveredDetailCom);
export default DeliveredDetail;

const styles = StyleSheet.create({
    containerDetail: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    containerButtonGroup: {
        height: 48,
        width: "100%",
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: 5
    },
});