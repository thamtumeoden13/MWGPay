import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    image,
    Alert
} from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { callFetchAPI } from "@actions/fetchAPIAction";
import HeaderRight from './HeaderRight'

class DetailPartnerCom extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Thông tin chi tiết thẻ',
            tabBarVisible: false,
            headerRight: (
                <HeaderRight navigation={navigation} />
            ),
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            bankAccountID: '',
            bankShortName: '',
            cardMask: ''
        };
    }

    componentDidMount() {
        const bankAccountID = this.props.navigation.getParam('BankAccountID', '');
        const bankShortName = this.props.navigation.getParam('BankShortName', '');
        const cardMask = this.props.navigation.getParam('CardMask', '');
        this.setState({
            bankAccountID,
            bankShortName,
            cardMask
        })
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            setTimeout(async () => {
                const timeout = await this.appSettingData();
                this.interval = setInterval(() => {
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

    render() {
        const { bankShortName, cardMask } = this.state

        return (
            <Card
                image={require('@assets/img/logoBank/ICB.png')}
                imageProps={{
                    resizeMode: "contain"
                }}
                imageStyle={{ height: 60, width: Math.floor(Dimensions.get('window').width) / 2, }}
            >
                <View style={styles.cardContent}>
                    <View style={styles.item}>
                        <View style={styles.pullLeft}>
                            <Text>Tài Khoản</Text>
                        </View>
                        <View style={styles.pullRight}>
                            <Text>{bankShortName}</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.pullLeft}>
                            <Text>Số tài Khoản</Text>
                        </View>
                        <View style={styles.pullRight}>
                            <Text>{cardMask}</Text>
                        </View>
                    </View>
                </View>
            </Card>
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

const DetailPartner = connect(mapStateToProps, mapDispatchToProps)(DetailPartnerCom);
export default DetailPartner;

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