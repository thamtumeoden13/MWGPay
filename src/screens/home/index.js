import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Dimensions,
    Platform
} from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";

import { ImageBackgroundBanner } from '@components/mainApp/body/ImageBackgroundBanner';
import { Search } from '@components/mainApp/header';
import { FlatListComponent } from '@componentsCommon/flatList';
import { dataMainMenu } from '@constants/dataTest';
import { formatData } from '@utils/function';
import LottieView from 'lottie-react-native';

const numColumns = 4;

class HomeCom extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        header: props => <Search navigation={navigation} />,
    })

    constructor(props) {
        super(props);
        this.state = {
            wallet: [],
            isVisible: false,
            fullName: '',
            isLoading: true,
            hasConnectedBank: false,
        }
    }

    componentDidMount() {
        const fullName = this.props.AppInfo.LoginInfo.LoginUserInfo.FullName;
        this.setState({
            fullName
        })
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.setState({ isLoading: true, });
            setTimeout(() => {
                this.getBankAccount();
            }, 500);
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
                    this.setState({ isLoading: false })
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
        let hasConnectedBank = false;
        let totalAccountList = 0;
        this.props.callFetchAPI(APIHostName, SearchAPIPath, "").then(apiResult => {
            if (apiResult && !apiResult.IsError && apiResult.ResultObject.length > 0) {
                hasConnectedBank = true;
                totalAccountList += apiResult.ResultObject.length;
                this.setState({
                    hasConnectedBank: true,
                    isLoading: false
                });
            }
            this.getCreditAccountList(hasConnectedBank, totalAccountList)
        });
    }

    getCreditAccountList = (hasConnectedBank, totalAccountList) => {
        const APIHostName = "CustomerEWalletAPI";
        const SearchAPIPath = "api/CreditAccount/ListByWalletID";
        this.props.callFetchAPI(APIHostName, SearchAPIPath, "").then(apiResult => {
            if (apiResult && !apiResult.IsError && apiResult.ResultObject.length > 0) {
                totalAccountList += apiResult.ResultObject.length;
                hasConnectedBank = true
            }
            this.setState({
                hasConnectedBank,
                isLoading: false,
            });
            this.storeData(totalAccountList)
        });
    }

    storeData = async (totalAccountList) => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo');
        if (StorageInfo) {
            let userInfo = JSON.parse(StorageInfo)
            if (userInfo) {
                userInfo.totalAccountList = totalAccountList;
                await AsyncStorage.setItem('UserInfo', JSON.stringify(userInfo))
            }
        }
    }

    onPressItem = (item) => {
        this.setState({ isLoading: false, });
        setTimeout(() => {
            this.props.navigation.navigate(item.route,
                {
                    dataItem: item,
                }
            );
        }, 50);

    }

    _keyExtractor = (item) => item.key.toString();

    render() {
        const { isVisible, fullName, isLoading, hasConnectedBank } = this.state;
        return (
            <View style={styles.container}>
                {isLoading ?

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {Platform.OS == 'ios' ?
                            <ImageBackground style={{ width: 60, height: 60, justifyContent: 'center', alignContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                                resizeMode='contain'
                                source={require('@assets/bg/loading.gif')}
                            >
                            </ImageBackground>
                            :
                            <View style={styles.bottomModal}>
                                <LottieView
                                    source={require('@assets/bg/material-wave-loading.json')}
                                    colorFilters={[{
                                        keypath: "button",
                                        color: "#F00000"
                                    }, {
                                        keypath: "Sending Loader",
                                        color: "#F00000"
                                    }]}
                                    style={{ width: 80, height: 80, justifyContent: 'center', }}
                                    autoPlay
                                    loop
                                />
                            </View>
                        }
                    </View>
                    :
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={styles.blockNoti}>
                            {hasConnectedBank ?
                                <View style={styles.bannerHome}>
                                    <ImageBackgroundBanner
                                        data={[
                                            {
                                                imageName: 'banner.jpeg'
                                            },
                                            {
                                                imageName: 'jetsta.jpg'
                                            },
                                            {
                                                imageName: 'logo-vietnammobile-dep_010446829.jpg'
                                            },
                                            {
                                                imageName: 'logo-viettel_105524546.png'
                                            },
                                            {
                                                imageName: 'logoViettel.jpg'
                                            },
                                        ]}
                                    />
                                </View>
                                :
                                <View style={styles.blockLinkBank}>
                                    <View style={styles.blockLinkBankContent}>
                                        <Text h3 h3Style={{ fontSize: 14, marginVertical: 7, }}>Hi <Text style={{ textTransform: 'capitalize' }}>{fullName}</Text>, chào mừng đến với MWGPay </Text>
                                        <Text style={{ fontSize: 12, marginBottom: 7, }}>Hãy liên kết tài khoản để nhận ngay gói quà bí mật dành cho bạn.</Text>
                                        <Button
                                            title="Liên kết ngay"
                                            buttonStyle={{ width: 130, borderRadius: 5 }}
                                            onPress={() => this.props.navigation.navigate("PartnerLink1")}
                                        />
                                    </View>
                                    <View style={styles.blockLinkBankIcon}>
                                        <ImageBackground
                                            resizeMode='contain'
                                            source={require('@assets/icon/gift-box-icon.png')}
                                            style={{ width: 90, height: 90, }}
                                        />
                                    </View>
                                </View>
                            }
                        </View>
                        <FlatListComponent
                            data={formatData(dataMainMenu, numColumns)}
                            numColumns={numColumns}
                            rowItemType="MenuItemIcon"
                            onPress={this.onPressItem}
                            flatListStyle={styles.flatListStyle}
                        />
                    </View>
                }

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

const Home = connect(mapStateToProps, mapDispatchToProps)(HomeCom);
export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff1f4',
    },
    flatListStyle: {
        flex: 1,
        marginVertical: 5
    },
    blockNoti: {
        marginTop: 5,
        backgroundColor: '#fff',

    },
    blockLinkBank: {

        flexDirection: 'row',
        width: '100%',
        height: 135,
    },
    blockLinkBankContent: {
        width: Math.floor(Dimensions.get('screen').width * 0.7),
        height: "100%",
        paddingLeft: 10,

    },
    blockLinkBankIcon: {
        position: 'relative',
        //transform: [{ translateY: 35 }],
        width: Math.floor(Dimensions.get('screen').width * 0.3),
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    bannerHome: {
        flexDirection: 'row',
        width: '100%',
        height: 135,
    },

    bottomModal: {
        justifyContent: 'center',
        alignItems: "center",
        margin: 0,
    }
});