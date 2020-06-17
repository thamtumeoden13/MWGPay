import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    ActivityIndicator,
    StatusBar,
    Text,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import { FlatListComponent } from '@componentsCommon/flatList';
import { formatData, getDisplayItemService } from '@utils/function';
import { Service_Category_ID_Water } from '@constants/appSetting';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";
import { callGetCache } from "@actions/cacheAction";
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import { ModalLoading } from '@componentsCommon/modal/ModalLoading';

const numColumns = 3;

class ServiceCom extends Component {
    static navigationOptions = {
        title: 'Tất cả dịch vụ'
    }

    constructor(props) {
        super(props);
        this.state = {
            wallet: [],
            isVisible: false,
            isLoading: false,
            listDataService: [],
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
                    this.setState({ isVisible: false, isLoading: false, isModalAlert: false })
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
        const cacheKeyID = "EWALLETCOMMONCACHE.SERVICE";
        this.props.callGetCache(cacheKeyID).then(cacheResult => {
            if (cacheResult && !cacheResult.IsError) {
                this.setState({
                    dataService: cacheResult.ResultObject.CacheData

                })
                this.formatDataService(cacheResult.ResultObject.CacheData)
            }
            else {
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'error',
                    titleModalAlert: 'Lỗi lấy cache thông tin dịch vụ',
                    contentModalAlert: cacheResult.Message
                });
            }
        });
    }

    formatDataService = (result) => {
        const dataSort = result.sort((a, b) => (a.ServiceCategoryID > b.ServiceCategoryID) ? 1 : (a.ServiceCategoryID === b.ServiceCategoryID) ? ((a.ServiceID > b.ServiceID) ? 1 : -1) : -1);
        let listDataService = [];
        let currentServiceCategoryID = '';
        dataSort.map((item, index) => {
            if (currentServiceCategoryID != item.ServiceCategoryID) {
                listDataService.push({
                    key: item.ServiceCategoryID,
                    title: item.ServiceCategoryName,
                })
                currentServiceCategoryID = item.ServiceCategoryID;
            }
        });
        listDataService.map((item, index) => {
            let dataMenu = []
            const dataFil = dataSort.filter((itemF, indexF) => {
                return itemF.ServiceCategoryID == item.key && itemF.IsActived == true
            })
            const { icon, type, color, size } = getDisplayItemService(item.key)
            if (item.key == Service_Category_ID_Water) {
                let itemDataMenu = dataFil[0];
                itemDataMenu.allDetailData = dataFil;
                dataMenu.push(itemDataMenu);
            }
            else {
                dataMenu = dataFil;
            }
            dataMenu.map((itemM) => {
                itemM.key = itemM.ServiceID
                itemM.title = itemM.ServiceName
                itemM.icon = icon
                itemM.type = type
                itemM.color = color
                itemM.size = size
                return itemM
            })
            item.dataMenu = dataMenu
            return item
        })
        this.setState({ listDataService })
    }

    onPressItem = (item, index) => {
        if (item.MobileScreenRoute && item.MobileScreenRoute.length > 0)
            this.props.navigation.navigate(item.MobileScreenRoute, {
                dataItem: item,
            });
    }

    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
    }

    render() {
        const { isVisible, isLoading, listDataService,
            isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ModalCenterAlert
                    isCancel={true}
                    isOK={true}
                    isVisible={isModalAlert}
                    typeModal={typeModalAlert}
                    titleModal={titleModalAlert}
                    contentModal={contentModalAlert}
                    onCloseModalAlert={this.onCloseModalAlert}
                />
                <View style={{ flex: 1, backgroundColor: '#eff1f4', justifyContent: 'center', }}>
                    {listDataService.length > 0
                        ?
                        listDataService.map((itemL, indexL) => {
                            return (
                                <FlatListComponent
                                    data={formatData(itemL.dataMenu, numColumns)}
                                    numColumns={numColumns}
                                    rowItemType="MenuItemImage"
                                    onPress={this.onPressItem}
                                    flatListStyle={styles.flatListStyle}
                                    headerTitle={itemL.title}
                                    headerType="HeaderTitleFlatList"
                                    key={indexL.toString()}
                                />
                            )
                        })
                        :
                        <ImageBackground style={{ width: 60, height: 60, justifyContent: 'center', alignContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                            resizeMode='contain'
                            source={require('@assets/bg/loading.gif')}
                        ></ImageBackground>
                    }
                </View>
            </ScrollView>
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

const Service = connect(mapStateToProps, mapDispatchToProps)(ServiceCom);
export default Service;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    flatListStyle: {
        marginVertical: 5
    }
});