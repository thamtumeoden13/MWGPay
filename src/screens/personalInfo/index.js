import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { updateUserInfo } from "@actions/loginAction";
import { callGetCache } from "@actions/cacheAction";

import { FlatListComponent } from '@componentsCommon/flatList';
import { ModalBottomHalf } from '@componentsCommon/modal/ModalBottomHalf';
import { ModalConfigContent } from '@components/personalInfo/ModalConfigContent';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { getFormattedDate, getDisplayDetailModalAlert } from '@utils/function'

class PersonalInfoCom extends Component {
    static navigationOptions = {
        title: 'Thông tin cá nhân'
    }
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            isLoading: false,
            dataProvince: [],
            dataDistrict: [],
            dataWard: [],
            styleContainerModal: {
                height: "30%",
                width: "100%",
                justifyContent: "flex-start",
                backgroundColor: 'white',
            },
            modalType: '',
            idCard: '',
            birthday: '',
            email: '',
            gender: true,
            address: '',
            provinceID: '',
            districtID: '',
            wardID: '',
            fullNameAddress: '',
            dataInfo1: [
                {
                    name: 'Ảnh đại diện',
                    img_uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                    // img_uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=',
                    // modalType: "Avatar"
                },
            ],
            dataInfo2: [
                {
                    title: 'Mã QR của tôi',
                    icon: 'qrcode',
                    type: "font-awesome",
                    modalType: "",
                    router: "QRCodePersonalInfo"
                },
                {
                    title: 'Hạn mức giao dịch',
                    icon: 'gears',
                    type: "font-awesome",
                    rightTitle: "500,000đ/ngày",
                    // modalType: "TransactionLimit"
                },
            ],
            dataInfo3: [],
            dataInfo4: [],
            dataInfo5: [],
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
            actionModalAlert: ''
        };
    }

    componentDidMount() {
        this.getProvince();
        const loginUserInfo = this.props.AppInfo.LoginInfo.LoginUserInfo
        this.updateStateDataInfo(loginUserInfo)
        this.appUserInfo()
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.props.navigation.push("Lock3", { routeName: this.props.navigation.state.routeName })
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

    appUserInfo = async (avatarImage) => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo && userInfo.avatarImage) {
                const img_uri = `data:image/jpeg;base64,${userInfo.avatarImage}`
                const dataInfo1 = [
                    {
                        name: 'Ảnh đại diện',
                        img_uri: img_uri,
                    },
                ]
                this.setState({ dataInfo1 })

            }
            if (avatarImage) {
                userInfo.avatarImage = avatarImage
                await AsyncStorage.setItem('UserInfo', JSON.stringify(userInfo))
            }
        }
    }

    getProvince = () => {
        const cacheKeyID = "EWALLETCOMMONCACHE.PROVINCE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.setState({
                    dataProvince: cacheResult.ResultObject.CacheData
                })
                this.getDistrict();
            }
            else {
                // console.log("getProvince fail", cacheResult.MessageDetail)
            }
        });
    }

    getDistrict = () => {
        const cacheKeyID = "EWALLETCOMMONCACHE.DISTRICT";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.setState({
                    dataDistrict: cacheResult.ResultObject.CacheData
                })
                this.getWard();
            }
            else {
                //console.log("getDistrict fail", cacheResult.MessageDetail)
            }
        });
    }

    getWard = () => {
        const cacheKeyID = "EWALLETCOMMONCACHE.WARD";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.setState({
                    dataWard: cacheResult.ResultObject.CacheData
                })
            }
            else {
                //console.log("getWard fail", cacheResult.MessageDetail)
            }
        });
    }

    showModal = (item) => {
        if (item.modalType) {
            this.setState({ isModalVisible: true, modalType: item.modalType })
        }
        if (item.router) {
            this.props.navigation.navigate(item.router);
        }
    }
    updateAvatarImage = () => {
        this.props.navigation.navigate("ImagePicker", { onTakePhoto: this.onTakePhoto })
    }

    onTakePhoto = ({ imageBase64 }) => {
        this.setState({ isLoading: true })
        const img_uri = `data:image/jpeg;base64,${imageBase64}`
        const dataInfo1 = [
            {
                name: 'Ảnh đại diện',
                img_uri: img_uri,
            },
        ]
        this.setState({ dataInfo1 })
        //////////////////////////////////////////////
        const walletID = this.props.AppInfo.LoginInfo.LoginUserInfo.WalletID;
        const signature = createSignature(walletID + imageBase64);
        const avatarImageInfo = {
            WalletID: walletID,
            AvatarImage: imageBase64,
            Signature: signature
        };
        this.callUpdateAvatar(avatarImageInfo, imageBase64);
    }

    callUpdateAvatar = (avatarImageInfo, imageBase64) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Wallet/UpdateAvatar";
        this.props.callFetchAPI(APIHostName, APIPath, avatarImageInfo).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        const { type, title, content, action } = getDisplayDetailModalAlert(apiResult.StatusID, 'Lỗi cập nhật thông tin ví', apiResult.Message)
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: type,
                            titleModalAlert: title,
                            contentModalAlert: content,
                            actionModalAlert: action
                        })
                    }, 100);
                }
                else {
                    this.asyncModalLoading(null, imageBase64)
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'success',
                            titleModalAlert: "Cập nhật thông tin ví",
                            contentModalAlert: "Cập nhật ảnh đại diện thành công",
                            actionModalAlert: '0'
                        })
                    }, 100);
                }
            }
            else {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi hệ thống gọi API cập nhật ảnh đại diện',
                        contentModalAlert: "Vui lòng tắt App và thao tác lại",
                        actionModalAlert: '0'
                    })
                }, 100);
            }
        });
    }
    _onConfirm = (idCard, birthday, email, gender, address, provinceID, districtID, wardID, fullNameAddress, ) => {
        const walletID = this.props.AppInfo.LoginInfo.LoginUserInfo.WalletID;
        let walletUpdateObject = {};
        let userInfo = this.props.AppInfo.LoginInfo.LoginUserInfo;
        let signature = "";
        switch (this.state.modalType) {
            case 'Email':
                signature = createSignature(walletID + email + 1);
                walletUpdateObject = {
                    WalletID: walletID,
                    Email: email,
                    FieldType: 1,
                    Signature: signature
                };
                userInfo.Email = email;
                break;
            case 'IdentityCard':
                signature = createSignature(walletID + idCard + 2);
                walletUpdateObject = {
                    WalletID: walletID,
                    IDCard: idCard,
                    FieldType: 2,
                    Signature: signature
                };
                userInfo.IDCard = idCard;
                break;
            case 'Gender':
                signature = createSignature(walletID + gender + 3);
                walletUpdateObject = {
                    WalletID: walletID,
                    Gender: gender,
                    FieldType: 3,
                    Signature: signature
                };
                userInfo.Gender = gender;
                break;

            case 'Birthday':
                signature = createSignature(walletID + new Date(birthday) + 4);
                walletUpdateObject = {
                    WalletID: walletID,
                    Birthday: new Date(birthday),
                    FieldType: 4,
                    Signature: signature
                };
                userInfo.Birthday = new Date(birthday);
                break;
            case 'Address':
                signature = createSignature(walletID + 4 + provinceID + districtID + wardID + address + fullNameAddress + 5);
                walletUpdateObject = {
                    WalletID: walletID,
                    CountryID: 4,
                    ProvinceID: provinceID,
                    DistrictID: districtID,
                    WardID: wardID,
                    Address: address,
                    FullAddress: fullNameAddress,
                    FieldType: 5,
                    Signature: signature
                };
                userInfo.CountryID = 4;
                userInfo.ProvinceID = provinceID;
                userInfo.DistrictID = districtID;
                userInfo.WardID = wardID;
                userInfo.Address = address;
                userInfo.FullAddress = fullNameAddress;
                break;
        }
        this.callUpdateWalletInfo(walletUpdateObject, userInfo);
    }

    callUpdateWalletInfo = (walletUpdateObject, userInfo) => {
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Wallet/UpdateOneField";
        this.props.callFetchAPI(APIHostName, APIPath, walletUpdateObject).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        const { type, title, content, action } = getDisplayDetailModalAlert(loginResult.StatusID, 'Lỗi cập nhật thông tin ví', apiResult.Message)
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: type,
                            titleModalAlert: title,
                            contentModalAlert: content,
                            actionModalAlert: action
                        })
                    }, 100);
                }
                else {
                    this.asyncModalLoading(userInfo)
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi hệ thống gọi API cập nhật thông tin ví",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại",
                        actionModalAlert: '0'
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = (userInfo, avatarImage) => {
        this.setState({ isModalVisible: false, isLoading: false });
        if (userInfo) {
            this.props.updateUserInfo(userInfo);
            this.updateStateDataInfo(userInfo)
        }
        if (avatarImage) {
            this.appUserInfo(avatarImage)
        }
    }

    updateStateDataInfo = (userInfo) => {
        const birthday = userInfo.Birthday ? getFormattedDate(new Date(userInfo.Birthday)) : ''
        this.setState({
            idCard: userInfo.IDCard,
            birthday: userInfo.Birthday,
            email: userInfo.Email,
            gender: userInfo.Gender,
            address: userInfo.Address,
            provinceID: userInfo.ProvinceID,
            districtID: userInfo.DistrictID,
            wardID: userInfo.WardID,
            fullNameAddress: userInfo.FullAddress,
            dataInfo3: [
                {
                    title: 'Loại tài khoản',
                    icon: 'github-alt',
                    type: 'font-awesome',
                    rightTitle: "Chưa xác thực",
                    // modalType: "AccountType"
                },
                {
                    title: 'Số CMND/CCCD',
                    icon: 'idcard',
                    type: 'antdesign',
                    rightTitle: userInfo.IDCard.length > 0 ? userInfo.IDCard : 'Chưa xác định',
                    modalType: "IdentityCard"
                },
                {
                    title: 'Ngày sinh',
                    icon: 'antdesign',
                    type: 'antdesign',
                    rightTitle: birthday.length > 0 ? birthday : 'Chưa xác định',
                    modalType: "Birthday"
                },
            ],
            dataInfo4: [
                {
                    title: 'Email',
                    icon: 'mail',
                    type: 'antdesign',
                    rightTitle: userInfo.Email.length > 0 ? userInfo.Email : 'Chưa xác định',
                    modalType: "Email"
                },
            ],
            dataInfo5: [
                {
                    title: 'Giới tính',
                    icon: 'transgender',
                    type: 'font-awesome',
                    rightTitle: userInfo.Gender == true ? 'Nam' : 'Nữ',
                    modalType: "Gender"
                },
                {
                    title: 'Địa chỉ',
                    icon: 'address-book',
                    type: 'font-awesome',
                    rightTitle: userInfo.FullAddress.length > 0 ? userInfo.FullAddress : 'Chưa xác định',
                    modalType: "Address"
                },
            ]
        })
    }

    onCloseModalAlert = (value) => {
        const { actionModalAlert } = this.state
        this.setState({ isModalAlert: false, typeModalAlert: '', actionModalAlert: '' })
        if (actionModalAlert == '0') {
            this.props.navigation.popToTop()
        } else if (actionModalAlert == '1') {
            this.props.navigation.navigate('SignIn')
        }
    }

    render() {
        const { isModalVisible, isLoading, styleContainerModal,
            modalType, idCard, birthday, email, gender, address,
            dataInfo1, dataInfo2, dataInfo3, dataInfo4, dataInfo5,
            dataProvince, dataDistrict, dataWard, provinceID, districtID, wardID, fullNameAddress,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
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
                <View>
                    <FlatListComponent
                        data={dataInfo1}
                        extraData={dataInfo1}
                        rowItemType="RowItemAvatar"
                        onPress={this.updateAvatarImage}
                        isUppercase={true}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={dataInfo2}
                        extraData={dataInfo2}
                        rowItemType="RowItemIcon"
                        onPress={this.showModal}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={dataInfo3}
                        // extraData={dataInfo3}
                        rowItemType="RowItemIcon"
                        onPress={this.showModal}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={dataInfo4}
                        // extraData={dataInfo4}
                        rowItemType="RowItemIcon"
                        onPress={this.showModal}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatListComponent
                        data={dataInfo5}
                        // extraData={dataInfo5}
                        rowItemType="RowItemIcon"
                        onPress={this.showModal}
                    />
                </View>
                <ModalBottomHalf
                    isVisible={isModalVisible}
                    content={
                        <ModalConfigContent
                            modalType={modalType}
                            idCard={idCard}
                            birthday={birthday}
                            email={email}
                            gender={gender}
                            address={address}
                            provinceID={provinceID}
                            districtID={districtID}
                            wardID={wardID}
                            fullNameAddress={fullNameAddress}
                            dataProvince={dataProvince}
                            dataDistrict={dataDistrict}
                            dataWard={dataWard}
                            onClose={() => this.setState({ isModalVisible: false })}
                            onConfirm={this._onConfirm}
                            styleContainer={styleContainerModal}
                        />
                    }
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

const PersonalInfo = connect(mapStateToProps, mapDispatchToProps)(PersonalInfoCom);
export default PersonalInfo;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
        paddingHorizontal: 5
    },
});