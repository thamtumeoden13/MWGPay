import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
} from 'react-native';
import { Avatar, CheckBox } from 'react-native-elements';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { updateUserInfo } from "@actions/loginAction";
import { callGetCache } from "@actions/cacheAction";

import { IdentityCard } from '@components/identityCard/GroupCheckIDCard'
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class AccountAuthenticationCom extends Component {
    static navigationOptions = {
        title: 'Xác thực tài khoản'
    }
    constructor(props) {
        super(props);
        this.state = {
            identityTypeID: "0",
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    onchangeIdentityTypeID = (identityTypeID) => {
        this.setState({ identityTypeID })
    }

    onPreAccAuth = () => {
        const { identityTypeID } = this.state
        if (identityTypeID == "-1") {
            this.setState({
                isModalAlert: true,
                typeModalAlert: 'warning',
                titleModalAlert: 'Thông báo',
                contentModalAlert: "Vui lòng chọn một loại giấy tờ"
            })
        }
        else {
            this.props.navigation.navigate("AccountAuthInputInfo", { IdentityTypeID: identityTypeID })
        }
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert } = this.state
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
                <View style={styles.containerIdentityCard}>
                    <IdentityCard
                        identityID={"0"}
                        onchangeIdentityTypeID={this.onchangeIdentityTypeID}
                    />
                </View>
                <ButtonBottomComponent
                    title="Xác thực"
                    onPress={this.onPreAccAuth}
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

const AccountAuthentication = connect(mapStateToProps, mapDispatchToProps)(AccountAuthenticationCom);
export default AccountAuthentication;

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