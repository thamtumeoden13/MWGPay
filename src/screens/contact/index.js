import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    Image,
} from 'react-native';
import Contacts from 'react-native-contacts';
import { ListItem, SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

export default class Contact extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Danh bạ',
    })
    constructor(props) {
        super(props)
        this.state = {
            DataContacts: [{
                givenName: "",
                familyName: "",
                phoneNumbers: [{
                    number: ""
                }],
                thumbnailPath: ""
            }],
            search: ''
        }
    }

    componentDidMount() {
        this.getContacts();
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

    getContacts = () => {
        Platform.OS === "ios" ?
            Contacts.getAll((err, contacts) => {
                if (err) {
                    throw err;
                }
                const DataContacts = contacts.filter((item, index) => { return item.phoneNumbers.length > 0 })
                this.setState({
                    DataContacts
                })
            })
            :
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Danh bạ',
                    'message': 'Ứng dụng này muốn truy cập danh bạ của bạn.'
                }
            ).then(() => {
                Contacts.getAll((err, contacts) => {
                    if (err) {
                        throw err;
                    }
                    const DataContacts = contacts.filter((item, index) => { return item.phoneNumbers.length > 0 })
                    this.setState({
                        DataContacts: contacts
                    })
                })
            })
    }

    chooseContact = (item) => {
        const phoneNumber = item.phoneNumbers[0].number.replace(/[^0-9]/g, '');
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onSelect({
            phoneNumber: phoneNumber,
            phoneName: item.givenName + " " + item.familyName
        });
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.chooseContact(item)}>
                {
                    Platform.OS === "ios" ?
                        <ListItem
                            title={`${item.givenName} ${item.familyName}`}
                            subtitle={item.phoneNumbers[0].number}
                            leftAvatar={
                                item.thumbnailPath ? {
                                    source: item.thumbnailPath && { uri: item.thumbnailPath },
                                } :
                                    item.givenName && item.familyName ?
                                        {
                                            title: item.familyName[0] + item.givenName[0]
                                        } :
                                        item.givenName ?
                                            {
                                                title: item.givenName[0]
                                            } : {
                                                title: item.familyName[0]
                                            }
                            }
                        />
                        :
                        <ListItem
                            title={`${item.givenName} ${item.familyName}`}
                            subtitle={item.phoneNumbers[0].number}
                            leftAvatar={
                                item.thumbnailPath ? {
                                    source: item.thumbnailPath && { uri: item.thumbnailPath },
                                } : {
                                        title: item.givenName[0]
                                    }
                            }
                        />
                }
            </TouchableOpacity>
        )
    }

    searchFilterFunction = text => {
        this.setState({
            value: text,
        });
        if (text !== '') {
            const newData = this.state.DataContacts.filter(item => {
                const itemData = `${item.givenName.toUpperCase()} ${item.familyName.toUpperCase()}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({
                DataContacts: newData,
            });
        } else {
            this.getContacts();
        }
    };

    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                lightTheme
                round
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
            />
        );
    };

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

    render() {
        const { DataContacts } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.lstContact}>
                    <FlatList
                        data={DataContacts}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.renderHeader}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    frmSearch: {
        height: 60,
        width: '100%',
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#dae2e682",
    },
    lstContact: {
        width: '100%',
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    item: {
        height: 30,
        width: '100%',
        backgroundColor: 'blue',
        flexDirection: "row",
        justifyContent: "center",
        alignContent: 'space-around',
        paddingLeft: 10,
    },
    fullName: {
        height: 30,
        width: '100%',
        flexDirection: "row",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: 'red',
    },
})
