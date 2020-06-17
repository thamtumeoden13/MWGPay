import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage'

import { connect } from 'react-redux';
import { callFetchAPI, createSignature } from "@actions/fetchAPIAction";

import { PartnerLinkInputDetailVietinBank } from '@components/partner/partnerLink/PartnerLinkInputDetailVietinBank'
import { ButtonBottomComponent } from '@componentsCommon/button/ButtonBottomComponent'
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class InputDetailCom extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "Nhập thẻ/tài khoản"
    })
    constructor(props) {
        super(props)
        const rootRoute = this.props.navigation.state.params.rootRoute;
        this.state = {
            rootRoute: rootRoute,
            number: '',
            memberSince: '',
            name: '',
            card: '',
            errors: {},
            isLoading: false,
            phoneNumber: '',
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount = () => {
        this.storeData();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
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

    storeData = async () => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                this.setState({
                    phoneNumber: userInfo.phoneNumber,
                })
            }
        }
    }

    convertStringToDate(dateStr) {
        const arrDate = dateStr.split('/');
        const result = new Date(2000 + parseInt(arrDate[1]), parseInt(arrDate[0]) - 1, 1, 7, 0);
        return result;
    }

    onChangeText = (number, memberSince, name, card) => {
        this.setState({ number, memberSince, name, card })
    }

    onConfirm = () => {
        const { number, memberSince, name, card } = this.state
        const { isError, errors } = this.checkErrorInput()
        if (!isError) {
            this.setState({ isLoading: true })
            const issueDate = this.convertStringToDate(memberSince);
            const dataToSign = "" + "" + 1 + number + name + memberSince.replace("/", "") + "" + card;
            const signature = createSignature(dataToSign);
            const cardLinkRequest =
            {
                CardLinkID: "",
                WalletID: "",
                BankID: 1,
                CardNumber: number,
                CardHolderName: name,
                CardIssueDate: issueDate,
                CardHolderPhoneNumber: "",
                CardHolderIDCard: card,
                Signature: signature
            };
            this.cardLinkRegister(cardLinkRequest);
        }
        else {
            this.setState({ errors, isLoading: false })
        }
    }

    checkErrorInput = () => {
        const { number, memberSince, name, card } = this.state
        let errors = {}
        let isError = false
        if (number.length <= 0) {
            errors.number = 'Vui lòng nhập số thẻ'
            isError = true;
        }
        if (memberSince.length <= 0) {
            errors.memberSince = 'Vui lòng nhập ngày hết hạn'
            isError = true
        } else {
            const regex = /\d\d\/\d\d/
            if (!regex.test(memberSince)) {
                errors.memberSince = 'Vui lòng nhập đúng định dạng (mm/dd)'
                isError = true
            }
        }
        if (name.length <= 0) {
            errors.name = 'Vui lòng nhập họ tên chủ thẻ'
            isError = true
        }
        if (card.length <= 0) {
            errors.card = 'Vui lòng nhập số CMND/Hộ chiếu'
            isError = true
        }
        else {
            if (card.length != 9 && card.length != 12) {
                errors.card = 'Vui lòng nhập số bao gồm 9 hoặc 12 chữ số'
                isError = true
            }
        }
        return { isError, errors }
    }

    cardLinkRegister = (cardLinkRequest) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CardLink/CardLinkRegister";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, cardLinkRequest).then(apiResult => {
            if (apiResult) {
                if (apiResult.IsError) {
                    this.asyncModalLoading()
                    setTimeout(() => {
                        this.setState({
                            isModalAlert: true,
                            typeModalAlert: 'error',
                            titleModalAlert: 'Lỗi đăng ký token',
                            contentModalAlert: apiResult.MessageDetail
                        })
                    }, 100);
                }
                else {
                    this.asyncModalLoading(cardLinkRequest, apiResult.ResultObject)
                }
            }
            else {
                this.asyncModalLoading()
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi hệ thống gọi API đăng ký token',
                        contentModalAlert: "Vui lòng tắt App và thao tác lại"
                    })
                }, 100);
            }
        });
    }

    asyncModalLoading = (cardLinkRequest, result) => {
        this.setState({ isLoading: false })
        if (cardLinkRequest && result) {
            const { rootRoute } = this.state
            if (rootRoute === "Home") {
                this.props.navigation.navigate("PartnerLinkInputOTP1", {
                    number: cardLinkRequest.CardNumber,
                    memberSince: cardLinkRequest.CardIssueDate,
                    name: cardLinkRequest.CardHolderName,
                    card: cardLinkRequest.CardHolderIDCard,
                    cardLinkID: result
                });
            }
            else {
                this.props.navigation.navigate("PartnerLinkInputOTP2", {
                    number: cardLinkRequest.CardNumber,
                    memberSince: cardLinkRequest.CardIssueDate,
                    name: cardLinkRequest.CardHolderName,
                    card: cardLinkRequest.CardHolderIDCard,
                    cardLinkID: result
                });
            }
        }
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { errors, isLoading, phoneNumber,
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
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, width: "100%", justifyContent: "center" }}>
                    <PartnerLinkInputDetailVietinBank
                        errors={errors}
                        onChangeText={this.onChangeText}
                        phoneNumber={phoneNumber}
                    />
                    <View style={styles.containerButtonGroup}>
                        <ButtonBottomComponent
                            title="Tiếp tục"
                            onPress={this.onConfirm}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
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

const InputDetail = connect(mapStateToProps, mapDispatchToProps)(InputDetailCom);
export default InputDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});