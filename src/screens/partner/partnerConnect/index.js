import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import { Button, Icon, ListItem } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import PartnerList from '@components/partner/partnerConnect'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class PartnerConnectCom extends Component {
    static navigationOptions = {
        title: 'Thẻ liên kết',
        tabBarVisible: false,
    }
    constructor(props) {
        super(props);
        const rootRoute = this.props.navigation.state.params.rootRoute;
        this.state = {
            rootRoute: rootRoute,
            bankAccountList: [],
            bankAccountID: '',
            accountMWGList: [],
            CreditAccountID: '',
            isLoading: true,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getBankAccount();
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false, isModalAlert: false })
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

    getBankAccount = () => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/BankAccount/ListByWalletID";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, "").then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: 'Lỗi lấy danh sách thẻ liên kết',
                            contentModalAlert: apiResult.Message
                        })
                    }, 100);
                }
                else {
                    this.setState({ bankAccountList: apiResult.ResultObject });
                    this.getAccountMWG();
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi gọi API lấy danh sách thẻ liên kết",
                        contentModalAlert: "Vui lòng tắt App và thử lại!"
                    })
                }, 100);
            }
        });
    }

    getAccountMWG = () => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CreditAccount/ListByWalletID";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, "").then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: 'Lỗi lấy danh sách thẻ liên kết',
                            contentModalAlert: apiResult.Message
                        })
                    }, 100);
                }
                else {
                    if (apiResult.ResultObject) {
                        apiResult.ResultObject.map((item, index) => {
                            item.BankAccountID = item.CreditAccountID,
                                item.BankID = item.CreditTypeID,
                                item.BankLogoURL = "",
                                item.BankName = item.CreditFullName,
                                item.BankShortName = "mwg",
                                item.CardMask = item.CreditUser,
                                item.WalletID = item.WalletID
                        });
                    }
                    this.setState({ accountMWGList: apiResult.ResultObject });
                    this.asyncModalLoading();
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: "Lỗi gọi API lấy liên kết tín dụng ERP",
                        contentModalAlert: "Vui lòng tắt App và thử lại!"
                    })
                }, 100);
            }
        });
    }

    onSelectPartner = (item, index) => {
        const { rootRoute } = this.state
        if (rootRoute === "Home") {
            this.props.navigation.navigate("DetailPartner1", {
                BankAccountID: item.BankAccountID,
                BankShortName: item.BankShortName,
                CardMask: item.CardMask,
                TypeConnect: 1, //Bank connected
                rootRoute: "Home"
            })
        }
        else {
            this.props.navigation.navigate("DetailPartner2", {
                BankAccountID: item.BankAccountID,
                BankShortName: item.BankShortName,
                CardMask: item.CardMask,
                TypeConnect: 1, //Bank connected
                rootRoute: "Profile"
            })
        }

    }

    onSelectPartnerMWG = (item, index) => {
        const { rootRoute } = this.state
        if (rootRoute === "Home") {
            this.props.navigation.navigate("CreditMWG1", {
                CreditAccountID: item.CreditAccountID,
                CreditFullName: item.BankShortName,
                CardMask: `${item.CreditUser}/${item.CreditFullName}`,
                TypeConnect: 2, //MWG connected
                rootRoute: "Home"
            })
        }
        else {
            this.props.navigation.navigate("CreditMWG2", {
                CreditAccountID: item.CreditAccountID,
                CreditFullName: item.BankShortName,
                CardMask: `${item.CreditUser}/${item.CreditFullName}`,
                TypeConnect: 2, //MWG connected
                rootRoute: "Profile"
            })
        }
    }

    onGoToPartnerLink = () => {
        const { rootRoute } = this.state
        if (rootRoute === "Home") {
            this.props.navigation.navigate("PartnerLink1")
        }
        else {
            this.props.navigation.navigate("PartnerLink2")
        }
    }

    asyncModalLoading = (result) => {
        this.setState({ isLoading: false })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { bankAccountList, accountMWGList, isLoading,
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
                <View style={styles.PartnerList}>
                    <PartnerList
                        bankAccountList={bankAccountList}
                        accountMWGList={accountMWGList}
                        onSelectPartner={this.onSelectPartner}
                        onSelectPartnerMWG={this.onSelectPartnerMWG}
                    />
                </View>
                <View style={styles.containerButtonGroup}>
                    <Button
                        icon={<Icon name="plus" type='font-awesome' size={18} color="#F5FCFF" />}
                        title='Thêm liên kết'
                        titleStyle={{ marginHorizontal: 5 }}
                        buttonStyle={styles.confirmButton}
                        containerStyle={styles.containerButton}
                        onPress={this.onGoToPartnerLink}
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

const PartnerConnect = connect(mapStateToProps, mapDispatchToProps)(PartnerConnectCom);
export default PartnerConnect;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    PartnerList: {
        flex: 1,
        width: '100%',
        marginVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addItem: {
        height: "10%",
        width: '90%',
    },
    containerButtonGroup: {
        height: 80,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "flex-end",
        marginVertical: 20
    },
    containerButton: {
        width: "90%",
        height: 40,
    },
    title: {
        textAlign: 'center'
    },
    confirmButton: {
        // backgroundColor: 'blue',
        borderRadius: 2,
    }
});