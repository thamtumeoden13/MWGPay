import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { PartnerLinkItem } from '@components/partner/partnerLink/PartnerLinkItem'
import { CreditLinkItem } from '@components/partner/creditLink/CreditLinkItem'
import { partnerData, partnerCreditData } from '@constants/dataTest'
import { formatData } from '@utils/function'

const numColumns = 3;

export default class PartnerLink extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: "Thêm thẻ/tài khoản"
    })
    constructor(props) {
        super(props);
        const rootRoute = this.props.navigation.state.params.rootRoute;
        this.state = {
            rootRoute
        }
    }

    componentDidMount() {
        // console.log("this.props.navigation", this.props.navigation)
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

    onPressPartnerLink = () => {
        const { rootRoute } = this.state
        if (rootRoute === "Home") {
            this.props.navigation.navigate("PartnerLinkInputDetail1");
        }
        else {
            this.props.navigation.navigate("PartnerLinkInputDetail2");
        }
    }

    _renderItem = ({ item }) => (
        <PartnerLinkItem
            item={item}
            numColumns={numColumns}
            onPress={this.onPressPartnerLink}
        />
    )

    _renderHeader = ({ item }) => {
        return (
            <View style={{ marginBottom: 10, marginHorizontal: 10 }}>
                <Text style={{ fontSize: 16 }}>
                    NGÂN HÀNG LIÊN KẾT VÍ MWG
                </Text>
                <Text style={{ fontSize: 12 }}>
                    Tặng đến 300.000đ cho lần nạp tiền đầu tiên
                </Text>
            </View>
        )
    }

    _renderCreditItem = ({ item }) => (
        <CreditLinkItem
            item={item}
            numColumns={numColumns}
            onPress={this.onPressCreditLink}
        />
    )
    _renderHeaderCredit = ({ item }) => {
        return (
            <View style={{ marginBottom: 10, marginHorizontal: 10 }}>
                <Text style={{ fontSize: 16 }}>
                    LIÊN KẾT TÍN DỤNG VÍ MWG
                </Text>
                <Text style={{ fontSize: 12 }}>
                    Tặng đến 300.000đ cho lần nạp tiền đầu tiên
                </Text>
            </View>
        )
    }
    onPressCreditLink = () => {
        const { rootRoute } = this.state
        if (rootRoute === "Home") {
            this.props.navigation.navigate("CreditLinkInputDetail1");
        }
        else {
            this.props.navigation.navigate("CreditLinkInputDetail2");
        }
    }

    _keyExtractor = (item) => item.key.toString();

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={formatData(partnerData, numColumns)}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        // style={styles.flatListStyle}
                        numColumns={numColumns}
                        ListHeaderComponent={this._renderHeader}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={formatData(partnerCreditData, numColumns)}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderCreditItem}
                        // style={styles.flatListStyle}
                        numColumns={numColumns}
                        ListHeaderComponent={this._renderHeaderCredit}
                    />

                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        paddingHorizontal: 5

    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    flatListStyle: {
        flex: 1,
        marginVertical: 15,
        marginHorizontal: 5
    }
});