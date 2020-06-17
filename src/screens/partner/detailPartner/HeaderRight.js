import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Alert
} from 'react-native';
import { Button, Icon, } from 'react-native-elements';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";
import { ModalBottomHalf } from '@componentsCommon/modal/ModalBottomHalf';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class HeaderRightCom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            bankAccountID: '',
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isModalVisible: false, isModalAlert: false })
                    this.props.navigation.push("Lock", { routeName: this.props.navigation.state.routeName });
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

    showModal = () => {
        this.setState({
            isModalVisible: true
        })
    }

    closeModal = () => {
        this.setState({
            isModalVisible: false
        })
    }

    preRemoveConnect = () => {
        const typeConnect = this.props.navigation.getParam('TypeConnect', '');
        if (typeConnect == 1) {
            this.removePartner()
        }
        else {
            this.removeCreditAccount()
        }
    }

    removePartner = () => {
        const bankAccountID = this.props.navigation.getParam('BankAccountID', '');
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CardLink/CardLinkUnRegister";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, bankAccountID).then(apiResult => {
            if (!apiResult.IsError) {
                Alert.alert("Xóa thẻ liên kết thành công", "",
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                        }
                    ],
                    { cancelable: false }
                );
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi xoá liên kết thẻ',
                        contentModalAlert: apiResult.Message
                    })
                }, 100);
            }

        });
    }

    removeCreditAccount = () => {
        const creditAccountID = this.props.navigation.getParam('CreditAccountID', '');
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CreditAccount/CreditAccountRevokeToken";
        const signature = createSignature(creditAccountID);
        const requestData = {
            CreditAccountID: creditAccountID,//"993EEB53B4FA7D0FE0536407010AC183"
            Signature: signature
        };
        this.props.callFetchAPI(APIHostName, SearchAPIPath, requestData).then(apiResult => {
            if (!apiResult.IsError) {
                Alert.alert("Xóa liên kết tín dụng thành công", "",
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.asyncModalLoading(true)
                        }
                    ],
                    { cancelable: false }
                );
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi xoá liên kết tín dụng',
                        contentModalAlert: apiResult.Message
                    })
                }, 100);
            }

        });
    }

    asyncModalLoading = (result) => {
        this.setState({
            isModalVisible: false
        })
        if (result) {
            const rootRoute = this.props.navigation.getParam('rootRoute', '');
            if (rootRoute === "Home") {
                this.props.navigation.navigate("PartnerConnect1")
            }
            else {
                this.props.navigation.navigate("PartnerConnect2")
            }
        }
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { isModalVisible,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state
        return (
            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                <Icon
                    name='ellipsis-h'
                    type='font-awesome'
                    color='#5a5757c7'
                    onPress={this.showModal}
                    iconStyle={{ paddingRight: 10, backgroundColor: '#fff', }}
                    containerStyle={{ paddingTop: 10, }}
                />
                <ModalBottomHalf
                    isVisible={isModalVisible}
                    content={
                        <View style={styles.containerContent}>
                            <View style={[styles.btnItem, { marginBottom: 20 }]}>
                                <Button
                                    title="Xóa liên kết"
                                    titleStyle={{ marginLeft: 8, color: '#8c0808' }}
                                    buttonStyle={{ backgroundColor: '#fff' }}
                                    icon={
                                        <FontAwesome
                                            name="trash-alt"
                                            size={15}
                                            color="#8c0808"
                                        />
                                    }
                                    onPress={this.preRemoveConnect}
                                />
                            </View>
                            <View style={styles.btnItem}>
                                <Button
                                    title="Hủy"
                                    onPress={this.closeModal}
                                    titleStyle={{ marginLeft: 8, color: '#585151' }}
                                    buttonStyle={{ backgroundColor: '#fff' }}
                                />
                            </View>
                        </View>
                    }
                />
                <ModalCenterAlert
                    isCancel={true}
                    isOK={true}
                    isVisible={isModalAlert}
                    typeModal={typeModalAlert}
                    titleModal={titleModalAlert}
                    contentModal={contentModalAlert}
                    onCloseModalAlert={this.onCloseModalAlert}
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
        }
    };
};

const HeaderRight = connect(mapStateToProps, mapDispatchToProps)(HeaderRightCom);
export default HeaderRight;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        backgroundColor: '#F5FCFF',
    },
    itemContainer: {
        height: Math.floor(Dimensions.get('window').height) / 3,
        width: '95%',
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'red',
        borderWidth: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
    },
    cardContent: {
        borderColor: '#bdb9b95c',
        borderTopWidth: 1,
        paddingTop: 20,
    },
    item: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    pullLeft: {
        flexDirection: 'column',
        width: '50%',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    },
    pullRight: {
        flexDirection: 'column',
        width: '50%',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
    },
    containerContent: {
        height: "20%",
        width: "90%",
        justifyContent: "center",
        backgroundColor: 'transparent',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
});