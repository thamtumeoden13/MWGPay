import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { updateUserInfo } from "@actions/loginAction";
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { Avatar } from 'react-native-elements';
import Birthday from '@components/birthday';
import Sex from '@components/sex';
import FullAddress from '@components/address/FullAddress';
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class InformationCom extends Component {
    static navigationOptions = {
        title: 'Cập nhật thông tin cá nhân'
    }
    constructor(props) {
        super(props);
        this.state = {
            birthday: "",
            birthdayFormat: '',
            identityID: "",
            address: '',
            provinceID: '',
            districtID: '',
            wardID: '',
            fullNameAddress: '',
            isLoading: false,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    componentDidMount() {

    }

    onPreInformation = () => {
        const { address, provinceID, districtID, wardID, fullNameAddress, identityID, birthday, birthdayFormat } = this.state;
        const walletID = this.props.AppInfo.LoginInfo.LoginUserInfo.WalletID;
        let userInfo = this.props.AppInfo.LoginInfo.LoginUserInfo;
        const signature = createSignature(walletID + identityID + birthday + 4 + provinceID + districtID + wardID + address + fullNameAddress);
        const walletUpdateObject = {
            WalletID: walletID,
            Gender: identityID == 1 ? true : false,
            Birthday: birthdayFormat,
            CountryID: 4,
            ProvinceID: provinceID,
            DistrictID: districtID,
            WardID: wardID,
            Address: address,
            FullAddress: fullNameAddress,
            Signature: signature
        };
        //console.log("onPreInformation", walletUpdateObject,aaa);
        this.callUpdateWalletInfo(walletUpdateObject, userInfo);
    }

    callUpdateWalletInfo = (walletUpdateObject, userInfo) => {
        this.setState({ isLoading: true })
        const APIHostName = "CustomerEWalletAPI";
        const APIPath = "api/Wallet/UpdateInfo";
        this.props.callFetchAPI(APIHostName, APIPath, walletUpdateObject).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: 'Lỗi cập nhật thông tin cá nhân',
                            contentModalAlert: apiResult.Message
                        })
                    }, 100);
                }
                else {
                    Alert.alert("Thành công",
                        "Cập nhật thông tin cá nhân thành công",
                        [
                            {
                                text: 'Đóng',
                                onPress: () => this.asyncModalLoading(userInfo)
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi hệ thống gọi API cập nhật thông tin cá nhân",
                        contentModalAlert: "Vui lòng tắt App và thao tác lại"
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = (userInfo) => {
        this.setState({ isLoading: false });
        if (userInfo) {
            this.storeData(true)
            this.props.updateUserInfo(userInfo);
            this.props.navigation.popToTop();
        }
    }

    onchangeIdentityID = (identityID) => {
        this.setState({ identityID })
    }

    onChangeBirthday = (birthday) => {
        let bir = birthday.year + birthday.month + birthday.day;
        let strDay = birthday.year + '-' + birthday.month + '-' + birthday.day;
        let convertBirthday = new Date(strDay);
        this.setState({ birthday: bir, birthdayFormat: convertBirthday })
    }

    onChangeAddress = (address, provinceID, districtID, wardID, fullNameAddress) => {
        //console.log("address", address, provinceID, districtID, wardID, fullNameAddress)
        this.setState({ address, provinceID, districtID, wardID, fullNameAddress })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    storeData = async (isUpdatedPersonalInfo) => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (isUpdatedPersonalInfo) {
                userInfo.isUpdatedPersonalInfo = isUpdatedPersonalInfo
                await AsyncStorage.setItem('UserInfo', JSON.stringify(userInfo))
            }
        }
    }

    render() {
        const { isLoading, isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert } = this.state
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                <View>
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
                        <Text style={{ flexDirection: 'column', fontSize: 20, color: '#333', width: '100%', height: 30, lineHeight: 30, justifyContent: 'center', alignContent: 'center', textAlign: "center", textTransform: 'uppercase', }}>Nguyen Van A</Text>
                        <Text style={{ flexDirection: 'column', width: '100%', fontSize: 16, color: 'gray', textAlign: "center", }}>Cập nhật hình ảnh đại diện</Text>
                    </View>
                    <Sex
                        onchangeIdentityID={this.onchangeIdentityID}
                    />
                    <Birthday onChangeBirthday={this.onChangeBirthday} />
                    <FullAddress
                        onChangeAddress={this.onChangeAddress}
                    />
                    <ButtonBottomComponent
                        title="Xác thực"
                        onPress={this.onPreInformation}
                    />

                </View>
            </KeyboardAwareScrollView>

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

    };
};

const Information = connect(mapStateToProps, mapDispatchToProps)(InformationCom);
export default Information;

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
    containerSex: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 5,
        paddingVertical: 10,

    },
    containerName: {
        width: '100%',
        paddingHorizontal: 5,
        paddingVertical: 10,
    }
});