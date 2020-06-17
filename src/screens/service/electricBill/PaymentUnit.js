import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { callGetCache } from "@actions/cacheAction";
import { Service_Category_ID_Electric } from "@constants/appSetting";

import { CDN_IMG } from "@constants/systemVars.js";
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

class PaymentUnitCom extends Component {
    static navigationOptions = {
        title: 'Thanh toán hóa đơn'
    }
    constructor(props) {
        super(props)
        this.state = {
            dataService: [],
            isLoading: false,
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: ''
        }
    }

    componentDidMount() {
        this.getCacheService();

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

    getCacheService = () => {
        this.setState({ isLoading: true })
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            const data = cacheResult.ResultObject.CacheData;
            let dataServiceItem = [];
            if (cacheResult && !cacheResult.IsError) {
                data.filter((item, index) => {
                    if (item.ServiceCategoryID == Service_Category_ID_Electric) {
                        dataServiceItem.push(item)
                    }
                })
                this.setState({
                    dataService: dataServiceItem,
                    isLoading: false
                })
            }
            else {
                this.asyncModalLoading();
                setTimeout(() => {
                    this.setState({
                        isModalAlert: true,
                        typeModalAlert: 'error',
                        titleModalAlert: 'Lỗi nạp danh sách dịch vụ',
                        contentModalAlert: apiResult.Message
                    });
                }, 100);
            }
        });
    }

    renderItem = ({ item, index }) => {
        const onPressItem = (item, index) => {
            this.props.navigation.navigate('CustomerInfo', {
                dataItem: item,
            })
        }
        let uri = CDN_IMG + item.ServiceLogoURL;
        return (
            <ListItem
                title={item.ServiceName}
                leftAvatar={{
                    rounded: false,
                    source: {
                        uri: uri
                    }
                }}
                rightIcon={{ name: "chevron-right" }}
                onPress={() => onPressItem(item, index)}
            />
        )
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '96%',
                    backgroundColor: '#CED0CE',
                    marginHorizontal: "2%"
                }}
            />
        );
    };

    asyncModalLoading = () => {
        this.setState({ isLoading: false })
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { dataService, isLoading,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;

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
                <View style={styles.lstContact}>
                    <FlatList
                        data={dataService}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeparator}
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
        },
        callGetCache: (cacheKeyID) => {
            return dispatch(callGetCache(cacheKeyID));
        },
    };
};

const PaymentUnit = connect(mapStateToProps, mapDispatchToProps)(PaymentUnitCom);
export default PaymentUnit;

const styles = StyleSheet.create({
    container: {

    },
    title: {

    },
});