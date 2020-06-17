import React, { Fragment } from 'react'
import {
    Alert, View, Text, StyleSheet, StatusBar, UIManager, ScrollView,
    Linking, Platform, Dimensions, Animated, Easing,
    Switch, Image, TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Divider, Icon, ButtonGroup, Button, Input } from 'react-native-elements';
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { callFetchAPI } from "@actions/fetchAPIAction";
import AsyncStorage from '@react-native-community/async-storage';

import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ModalCenterHalf } from "@componentsCommon/modal/ModalCenterHalf";

import { GoogleMap } from '@components/maps/GoogleMap'
import {
    DeliveringDetail as Detail,
    DeliveringDetailCollapse as DetailCollapse,
    DeliveringDetailExpand as DetailExpand
} from '@components/delivery/delivering'
import { CancelShipmentOrder } from '@components/delivery/delivering/modalInputForm/CancelShipmentOrder'
import { ImageList } from '@components/delivery/delivering/modalInputForm/ImageList'
import { CollectMoney } from '@components/delivery/delivering/modalInputForm/CollectMoney'

import ClapButton from '@componentsCommon/button/ClapButton'

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

class DeliveringDetailCom extends React.Component {
    static navigationOptions = {
        title: 'Chi tiết Giao Hàng',
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
            shipmentOrderStepID: '',
            nextShipmentOrderStep: '',
            nextShipmentOrderStepName: '',
            direct: false,
            isCollapse: false,
            isExpand: false,
            distance: { text: "0 km", value: 0 },
            duration: { text: "0 mins", value: 0 },
            latitude: null,
            longitude: null,
            selectedIndex: 0,
            note: '',
            listImage: [],
            isModalInputForm: false,
            typeModalInputForm: 0,
            permission: {
                takePhoto: false,
                materialList: false,
                collectMoney: false
            },
            materialList: []
        }
    }

    componentDidMount() {
        this.asyncModalLoadingEnable();
        Linking.addEventListener('url', this._handleOpenURL);
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
        Linking.removeEventListener('url', this._handleOpenURL);
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

        if (isReloadData) {
            setTimeout(() => {
                this.loadShipmentOrderDetail(this.state.shipmentOrderID)
            }, 200);
        }
    }

    asyncModalLoadingEnable = () => {
        this.setState({ isLoading: true, isExpand: false, isCollapse: true, selectedIndex: 0 })
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
                    const shipmentOrderInfo = apiResult.ResultObject;
                    if (shipmentOrderInfo && shipmentOrderInfo.ShipmentOrderType_WF_NextList && shipmentOrderInfo.ShipmentOrderType_WF_NextList.length > 0) {
                        this.setState({ shipmentOrderInfo, materialList: shipmentOrderInfo.CombinedMaterialList });
                        this.setState({
                            shipmentOrderStepID: shipmentOrderInfo.ShipmentOrderType_WF_NextList[0].ShipmentOrderStepID,
                            nextShipmentOrderStep: shipmentOrderInfo.ShipmentOrderType_WF_NextList[0].NextShipmentOrderStep,
                            nextShipmentOrderStepName: shipmentOrderInfo.ShipmentOrderType_WF_NextList[0].NextShipmentOrderStepName,
                        })
                        let takePhoto = false
                        let materialList = false
                        let collectMoney = false
                        if (shipmentOrderInfo.CurrentStepPermissionList && shipmentOrderInfo.CurrentStepPermissionList.filter(e => { return e.ShipmentOrderPermissionID == 14 }).length > 0) {
                            materialList = true
                        }
                        if (shipmentOrderInfo.CurrentStepPermissionList && shipmentOrderInfo.CurrentStepPermissionList.filter(e => { return e.ShipmentOrderPermissionID == 21 }).length > 0) {
                            takePhoto = true
                        }
                        if (shipmentOrderInfo.CurrentStepPermissionList && shipmentOrderInfo.CurrentStepPermissionList.filter(e => { return e.ShipmentOrderPermissionID == 22 }).length > 0) {
                            collectMoney = true
                        }
                        // console.log({ takePhoto, materialList, collectMoney })
                        this.setState({ permission: { takePhoto, materialList, collectMoney } })
                    }
                    else {
                        this.asyncModalLoading(false, true);
                    }
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

    preNextShipmentOrderStep = () => {
        if (this.state.permission.takePhoto) {
            this.setState({ isModalInputForm: true, isCollapse: true, typeModalInputForm: 0 })
        }
        else {
            this.nextShipmentOrderStep(this.state.listImage)
        }
    }

    nextShipmentOrderStep = (listImage, note) => {
        this.setState({ direct: !this.state.direct });
        const { shipmentOrderID, shipmentOrderStepID, nextShipmentOrderStepName, nextShipmentOrderStep, userName } = this.state

        const imageUploadingRequestList = listImage.map((e, i) => {
            let element = {}
            element.ImageCaptureTime = new Date().toISOString()
            element.ImageUpLoadTime = new Date().toISOString()
            element.ImageCaptureGeoLocation = ""
            element.ImageContent = e.base64String
            element.IsCompressImageContent = false
            element.Note = e.description
            element.UploadUser = userName
            return element
        })

        // console.log({ imageUploadingRequestList })

        const APIHostName = "TMSAPI";
        const APIPath = "api/ShipmentOrder/ProcessWorkFlow";
        const APIParams = {
            "ShipmentOrderID": shipmentOrderID,
            "ShipmentOrderStepID": nextShipmentOrderStep,
            "ProcessUser": userName,
            "Note": note,
            "ImageUploadingRequestList": imageUploadingRequestList
        };
        // console.log(APIParams)
        this.props.callFetchAPI(APIHostName, APIPath, APIParams).then(apiResult => {
            // console.log("api/ShipmentOrder/ProcessWorkFlow:", apiResult);
            if (apiResult) {
                if (!apiResult.IsError) {
                    this.asyncModalLoading(true);
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            modalAlert: {
                                type: 'success',
                                title: "Thành công",
                                content: `Cập nhật quy trình - ${nextShipmentOrderStepName}`,
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
                                title: "Lỗi cập nhật quy trình ",
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
        // this.shouldShowCollapseDetail()
    }

    callPhone = () => {
        // console.log("callPhone")
        const { shipmentOrderInfo } = this.state
        let url = '';
        if (Platform.OS === 'android') {
            url = `tel:${shipmentOrderInfo.ReceiverPhoneNumber}`;
        } else {
            url = `telprompt:${shipmentOrderInfo.ReceiverPhoneNumber}`;
        }
        // url = "http://maps.apple.com/?ll=37.484847,-122.148386"
        // Linking.openURL(url);
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    console.error('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url)
                        .then((data) => console.error("then", data))
                        .catch((err) => { throw err; });
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }

    detailDirection = (distance, duration, latitude, longitude) => {
        this.setState({ distance, duration, latitude, longitude })
    }

    shouldShowCollapseDetail = () => {
        this.setState({
            isCollapse: !this.state.isCollapse,
            isExpand: false,
            selectedIndex: 0
        })
    }

    shouldShowExpandDetail = () => {
        this.setState({
            isExpand: !this.state.isExpand,
            selectedIndex: this.state.isExpand ? 0 : 1
        })

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
        this.setState({ isModalInputForm: false, typeModalInputForm: 0, isCollapse: true, isExpand: false })
    }

    updateIndex = (selectedIndex) => {
        // console.log({ selectedIndex })
        const isExpand = selectedIndex === 0 ? false : true;
        const isCollapse = selectedIndex === 0 ? true : false;
        this.setState({ isExpand, isCollapse, selectedIndex })
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

    takePhoto = () => {
        // console.log("chup anh")
        this.props.navigation.navigate("ImagePicker", { onTakePhoto: this.onTakePhoto })
    }

    onPressCancelOrder = () => {
        // console.log("onPressCancelOrder")
        this.setState({ isModalInputForm: true, isCollapse: true, isExpand: false, typeModalInputForm: 1 })
    }

    cancelOrder = (value) => {
        // console.log("huy don hang")
        const { shipmentOrderID, shipmentOrderStepID, userName } = this.state
        const APIHostName = "TMSAPI";
        const APIPath = "api/ShipmentOrder/UpdateCancelDelivery";
        const APIParams = {
            "ShipmentOrderID": shipmentOrderID,
            "CancelDeliveryReasonID": 1,
            "CancelDeliveryUser": userName,
            "CancelDeliveryReasonNote": value.note
        };
        this.onCloseModalInputForm()
        setTimeout(() => {
            this.props.callFetchAPI(APIHostName, APIPath, APIParams).then(apiResult => {
                // console.log("cancelOrder:", apiResult);
                if (apiResult) {
                    if (!apiResult.IsError) {
                        this.asyncModalLoading(false, true);
                        setTimeout(() => {
                            this.setState({
                                isModalAlert: true,
                                modalAlert: {
                                    type: 'success',
                                    title: "Huỷ đơn hàng",
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
                                    title: "Lỗi huỷ đơn hàng",
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
        }, 200);
    }

    onTakePhoto = ({ imageBase64 }) => {
        const img_uri = `data:image/jpeg;base64,${imageBase64}`
        this.setState({ img_uri })
        // console.log({ img_uri })
    }

    preUpdateSaleMaterial = (list) => {
        this.asyncModalLoadingEnable()
        setTimeout(() => {
            this.updateSaleMaterial(list)
        }, 200);
    }

    updateSaleMaterial = (list) => {
        const materialList = list.map((item, index) => {
            return {
                "ProductID": item.ProductID,
                "SaleQuantity": item.SaleQuantity,
                "Price": item.Price
            }
        })
        const { shipmentOrderID, shipmentOrderStepID, userName } = this.state
        const APIHostName = "TMSAPI";
        const APIPath = "api/ShipmentOrder/UpdateSaleMaterial";
        const APIParams = {
            "ShipmentOrderID": shipmentOrderID,
            "ShipmentOrderStepID": shipmentOrderStepID,
            "UpdateUser": userName,
            "MaterialList": materialList
        };
        // console.log({ list, materialList, APIParams })

        this.setState({ materialList })
        this.props.callFetchAPI(APIHostName, APIPath, APIParams).then(apiResult => {
            // console.log("UpdateSaleMaterial:", apiResult);
            if (apiResult) {
                this.asyncModalLoading(true);
                if (!apiResult.IsError) {
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            modalAlert: {
                                type: 'success',
                                title: "Thành công",
                                content: "Cập nhật thành công vật tư sử dụng",
                            }
                        })
                    }, 100);
                } else {
                    this.asyncModalLoading();
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            modalAlert: {
                                type: 'error',
                                title: "Lỗi cập nhật vật tư ",
                                content: apiResult.MessageDetail,
                            }
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

    renderModalInputForm = (typeModalInputForm) => {
        const { listImage, shipmentOrderInfo, nextShipmentOrderStepName } = this.state
        if (typeModalInputForm == 0) {
            return (
                <ImageList
                    listImage={listImage}
                    nextShipmentOrderStepName={nextShipmentOrderStepName}
                    uploadImage={this.uploadImage}
                />
            )
        }
        if (typeModalInputForm == 1) {
            return (
                <CancelShipmentOrder
                    cancelOrder={this.cancelOrder}
                    onCloseModalInputForm={this.onCloseModalInputForm}
                />
            )
        }
        return (
            <CollectMoney
                receiveMoney={this.receiveMoney}
                shipmentOrderInfo={shipmentOrderInfo}
            />
        )
    }

    uploadImage = (listImage, note) => {
        this.onCloseModalInputForm()
        setTimeout(() => {
            this.asyncModalLoadingEnable()
        }, 200);
        setTimeout(() => {
            this.nextShipmentOrderStep(listImage, note)
        }, 500);
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

    OnCloseModal = () => {
        this.setState({ isModalInputForm: false, isCollapse: true })
    }

    OnCloseCollectMoney = () => {
        this.setState({ isModalInputForm: false, isCollapse: true })
    }

    preCollectMoney = () => {
        // console.log("preCollectMoney")
        if (this.state.permission.collectMoney) {
            this.setState({ isModalInputForm: true, typeModalInputForm: 2, isCollapse: true, isExpand: false })
        }
        else {
            this.setState({
                isModalAlert: true,
                modalAlert: {
                    type: 'error',
                    title: "Lỗi thu tiền",
                    content: 'Không có quyền thu tiền, vui lòng liên hệ quản lý',
                },
            })
            // this.collectMoney()
        }
    }

    collectMoney = () => {
        const { shipmentOrderID, shipmentOrderStepID, userName, materialList, shipmentOrderInfo } = this.state

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
            shipmentOrderStepID,
            nextShipmentOrderStepName,
            direct,
            isCollapse,
            isExpand,
            distance,
            duration,
            isLoading,
            isModalAlert,
            modalAlert,
            selectedIndex,
            img_uri,
            isModalInputForm,
            typeModalInputForm
        } = this.state

        const buttons = ['Bản đồ', 'Chi tiết']

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
                <View style={styles.containerMap}>
                    <GoogleMap direct={direct} changeRouter={this.detailDirection}
                        originLoc={shipmentOrderInfo.SenderGeoLocation}
                        // destinationLoc={shipmentOrderInfo.ReceiverGeoLocation}
                        destinationAddress={shipmentOrderInfo.ReceiverFullAddress}
                        originAddress={shipmentOrderInfo.SenderFullName}
                    />
                </View>
                <View style={styles.containerButtonTop}>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{ height: 36, width: '100%' }}
                    />
                </View>
                <View style={styles.containerDetail}>
                    <View style={{ backgroundColor: 'transparent', marginBottom: 20 }}>
                        <View style={{
                            flexDirection: 'column',
                            width: Dimensions.get('window').width,
                            maxHeight: Dimensions.get('window').height * 0.6,
                            justifyContent: 'flex-end',
                        }}>
                            <View style={styles.headerDetail}>
                                {(!isCollapse || isExpand) &&
                                    <Icon
                                        type='font-awesome'
                                        name={isExpand ? 'chevron-down' : 'chevron-up'}
                                        color='#000'
                                        onPress={() => this.shouldShowExpandDetail()}
                                    />
                                }
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 16, color: 'gray' }}>K/C:</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'red' }}> {distance.text}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 16, color: 'gray' }}>T/G:</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'red' }}> {duration.text}</Text>
                                </View>
                                {(!isExpand || isCollapse) &&
                                    <Icon
                                        type='font-awesome'
                                        name={!isCollapse ? 'chevron-down' : 'chevron-up'}
                                        color='#000'
                                        onPress={() => this.shouldShowCollapseDetail()}
                                    />
                                }
                            </View>
                            {isExpand
                                ? <DetailExpand
                                    shipmentOrderInfo={shipmentOrderInfo}
                                    estimateDeliveryDistance={distance}
                                    estimateDeliveryDuration={duration}
                                    img_uri={img_uri}
                                    callPhone={this.callPhone}
                                    updateSaleMaterial={this.preUpdateSaleMaterial}
                                />
                                : !isCollapse
                                    ? <Detail
                                        shipmentOrderInfo={shipmentOrderInfo}
                                        callPhone={this.callPhone}
                                    />
                                    : <DetailCollapse shipmentOrderInfo={shipmentOrderInfo} onPress={this.shouldShowCollapseDetail} />
                            }
                            {!isCollapse &&
                                <View style={{
                                    flexDirection: 'column',
                                    backgroundColor: '#eff1f4',
                                    // height: 96, //isExpand ? 96 : 48,
                                    justifyContent: 'center',
                                    bottom: 0
                                }}>
                                    <ButtonBottomComponent
                                        title={nextShipmentOrderStepName}
                                        onPress={this.preNextShipmentOrderStep}
                                        containerButtonGroup={styles.containerButtonGroup}
                                    />
                                    {shipmentOrderInfo.TotalCOD &&
                                        <ButtonBottomComponent
                                            title="Thu tiền"
                                            onPress={this.preCollectMoney}
                                            containerButtonGroup={styles.containerButtonGroup}
                                        />
                                    }
                                </View>
                            }
                        </View>
                    </View>
                    {!isCollapse &&
                        <ClapButton
                            content={
                                <View style={{ height: 120, flexDirection: 'column', justifyContent: 'space-around' }}>
                                    <TouchableOpacity
                                        style={styles.clapChildContent}
                                        onPress={this.onPressCancelOrder}>
                                        <Text style={{ fontSize: 14, fontWeight: '400', color: '#fff' }}>Huỷ đơn</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            customStyleClap={styles.clapButton}
                            customStyleBubble={styles.clapBubble}
                        />
                    }
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

const DeliveringDetail = connect(mapStateToProps, mapDispatchToProps)(DeliveringDetailCom);
export default DeliveringDetail;

const styles = StyleSheet.create({
    containerMap: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    containerButtonTop: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        top: 20,
    },
    containerDetail: {
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // backgroundColor: 'pink',
        paddingTop: 20,
        bottom: 0
    },
    headerDetail: {
        height: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(225,225,225,0.7)',
        paddingHorizontal: 10
    },
    containerButtonGroup: {
        height: 48,
        width: "100%",
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: 5
    },
    clapButton: {
        bottom: 30,
        right: 30,
    },
    clapBubble: {
        bottom: 30,
        right: 30,
    },
    clapChildContent: {
        height: 48,
        width: 96,
        borderRadius: 8,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: "center"
    }
});