import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Alert,
} from 'react-native';
import { Avatar, CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage'

import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { updateUserInfo } from "@actions/loginAction";
import { callGetCache } from "@actions/cacheAction";

import { IdentityCardInput } from '@components/identityCard/IdentityCardInput'
import { IdentityCardImage } from '@components/identityCard/IdentityCardImage'
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';

class InputInfoAccCom extends Component {
    static navigationOptions = {
        title: 'Xác thực tài khoản'
    }
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            card: "",
            errors: {},
            isLoading: false,
            behindImageBase64: '',
            forwardImageBase64: '',
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            walletID: '',
            identityTypeID: ''
        };
    }

    componentDidMount() {
        const identityTypeID = this.props.navigation.getParam('IdentityTypeID', '');
        this.setState({ identityTypeID })
        this.storeData()
    }

    onAccAuth = () => {
        const { walletID, identityTypeID, name, card, behindImageBase64, forwardImageBase64 } = this.state
        const { isError, errors } = this.checkErrorInput()
        if (!isError) {
            this.setState({ isLoading: true })
            const signature = createSignature(walletID + identityTypeID + card + name + behindImageBase64 + forwardImageBase64 + "");
            const IDDocumentInfo = {
                "WalletID": walletID,// Mã ví
                "IDDocumentTypeID": identityTypeID,// Loại giấy tờ tùy thân
                "IDDocumentNumber": card,// Số giấy tờ tùy thân
                "FullNameOnIDDocument": name,// Họ và tên trên giấy tờ tùy thân
                "FrontIDDocumentImage": behindImageBase64,// Hình mặt trước giấy tờ tùy thân
                "BacksideIDDocumentImage": forwardImageBase64,// Hình mặt sau giấy tờ tùy thân
                "IDDocumentImageFormatName": "",// Định dạng hình giấy tờ tùy thân
                "Signature": signature
            }
            this.callUpdateIDDocument(IDDocumentInfo);
        }
        else {
            this.setState({ errors, isLoading: false })
        }
    }

    onChangeText = (name, card) => {
        this.setState({ name, card })
    }

    checkErrorInput = () => {
        const { name, card, behindImageBase64, forwardImageBase64 } = this.state
        let errors = {}
        let isError = false
        if (name.length <= 0) {
            errors.name = 'Vui lòng nhập họ tên chủ tài khoản'
            isError = true
        }
        if (card.length <= 0) {
            {
                errors.card = 'Vui lòng nhập số CMND/CCCD'
                isError = true
            }
        }
        else {
            if (card.length != 9 && card.length != 12) {
                errors.card = 'Vui lòng nhập số bao gồm 9 hoặc 12 chữ số'
                isError = true
            }
        }
        if (forwardImageBase64.length <= 0) {
            errors.documentImage = 'Vui lòng chụp ảnh mặt sau CMND/CCCD'
            isError = true
        }
        if (behindImageBase64.length <= 0) {
            errors.documentImage = 'Vui lòng chụp ảnh mặt trước CMND/CCCD'
            isError = true
        }
        return { isError, errors }
    }

    onPressBehindImage = () => {
        this.props.navigation.navigate("ImagePicker", { onTakePhoto: this.onTakePhotoBehind })
    }

    onPressForwardImage = () => {
        this.props.navigation.navigate("ImagePicker", { onTakePhoto: this.onTakePhotoForward })
    }

    onTakePhotoBehind = ({ imageBase64 }) => {
        this.setState({ behindImageBase64: imageBase64 })
    }

    onTakePhotoForward = ({ imageBase64 }) => {
        this.setState({ forwardImageBase64: imageBase64 })
    }

    callUpdateIDDocument = (IDDocumentInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Wallet/UpdateIDDocument";//UpdateAvatar
        this.props.callFetchAPI(APIHostName, APIPath, IDDocumentInfo).then(apiResult => {
            // console.log({ apiResult, IDDocumentInfo })
            this.asyncModalLoading();
            if (apiResult) {
                if (apiResult.IsError) {
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: "Cập nhật thông tin ví",
                            contentModalAlert: apiResult.Message
                        })
                    }, 100);
                }
                else {
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'success',
                            titleModalAlert: "Cập nhật thông tin ví",
                            contentModalAlert: "Thành công"
                        })
                    }, 100);
                    this.storeData(true)
                }
            }
            else {
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi hệ thống gọi API cập nhật ảnh đại diện',
                        contentModalAlert: "Vui lòng tắt App và thao tác lại"
                    })
                }, 100);
            }
        });
    }

    onCloseModalAlert = (value) => {
        setTimeout(() => {
            this.setState({ isModalAlert: false, typeModalAlert: '', })
            this.props.navigation.popToTop();
        }, 100);
    }

    storeData = async (isVerifiedWalletAccount) => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                this.setState({
                    walletID: userInfo.walletID,
                })
            }
            if (isVerifiedWalletAccount) {
                userInfo.isVerifiedWalletAccount = isVerifiedWalletAccount
                await AsyncStorage.setItem('UserInfo', JSON.stringify(userInfo))
            }
        }
    }

    asyncModalLoading = (result) => {
        this.setState({ isLoading: false })
        if (result) {
            this.props.navigation.popToTop()
        }
    }

    render() {
        const { isLoading, errors,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert,
            behindImageBase64, forwardImageBase64
        } = this.state
        return (
            <View style={styles.container}>
                <ModalCenterAlert
                    isCancel={true}
                    isOK={true}
                    isVisible={isModalAlert}
                    typeModal={typeModalAlert}
                    titleModal={titleModalAlert}
                    contentModal={contentModalAlert}
                    onCloseModalAlert={this.onCloseModalAlert}
                />
                <View>
                    <ModalLoading
                        isVisible={isLoading}
                    />
                </View>
                <View style={styles.containerAvatar}>
                    <Avatar
                        size="xlarge"
                        rounded
                        imageProps={{ resizeMode: 'cover' }}
                        activeOpacity={0.7}
                        source={{
                            uri:
                                'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                        }}
                        containerStyle={{}}
                        showEditButton={true}
                        onEditPress={() => console.log("call function edit avatar")}
                        iconStyle={{ width: 50, height: 50, backgroundColor: 'red' }}
                        editButton={
                            {
                                size: 20,
                                name: 'camera',
                                type: 'font-awesome',
                                color: '#333',
                                underlayColor: '#000'
                            }
                        }

                    />
                </View>
                <View style={styles.containerName}>
                    <Text style={{ fontSize: 20, color: '#000', textAlign: "center" }}>
                        Xác thực tài khoản
                    </Text>
                    <Text style={{ fontSize: 16, color: 'gray', textAlign: "center" }}>
                        Tài khoản được xác thực sẽ có mức độ bảo mật cao hơn
                    </Text>
                </View>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, }}
                >
                    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "center", alignItems: 'center' }}>
                        <IdentityCardInput
                            errors={errors}
                            onChangeText={this.onChangeText}
                        // phoneNumber={phoneNumber}
                        />
                        <IdentityCardImage
                            errors={errors}
                            behindImageBase64={behindImageBase64}
                            forwardImageBase64={forwardImageBase64}
                            onPressBehindImage={this.onPressBehindImage}
                            onPressForwardImage={this.onPressForwardImage}
                        // phoneNumber={phoneNumber}
                        />
                    </KeyboardAwareScrollView>
                </ScrollView>
                <ButtonBottomComponent
                    title="Xác thực"
                    onPress={this.onAccAuth}
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
        },
        updateUserInfo: (userInfo) => {
            return dispatch(updateUserInfo(userInfo));
        },
        callGetCache: (cacheKeyID) => {
            return dispatch(callGetCache(cacheKeyID));
        },

    };
};

const InputInfoAcc = connect(mapStateToProps, mapDispatchToProps)(InputInfoAccCom);
export default InputInfoAcc;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 5
    },
    containerAvatar: {
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 5,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: "center",
    },
    containerName: {
        width: '100%',
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    containerIdentityCard: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 5,
        paddingVertical: 10,
    }
});