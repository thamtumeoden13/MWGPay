import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import { callFetchAPI } from "@actions/fetchAPIAction";

const QRCodeComponent = (props) => {
    const [valueForQRCode, setValueForQRCode] = useState(props.valueForQRCode ? props.valueForQRCode : '');
    const [shortName, setShortName] = useState('');
    const [userInfo, setUserInfo] = useState(props.AppInfo.LoginInfo.LoginUserInfo ? props.AppInfo.LoginInfo.LoginUserInfo : {});

    useEffect(() => {
        setValueForQRCode(props.valueForQRCode)
    }, [props.valueForQRCode])

    useEffect(() => {
        setUserInfo(props.AppInfo.LoginInfo.LoginUserInfo)
    }, [props.userInfo])

    useEffect(() => {
        const info = props.AppInfo.LoginInfo.LoginUserInfo;
        const fullNameSplit = info.FullName.split(' ')
        let short = '';
        fullNameSplit.map((item, index) => {
            if (index < 2)
                short = short + item[0];
            setShortName(short);
        });
    }, [props.shortName])

    return (
        <View style={styles.containerQRCode}>
            <View style={styles.containerInfoUser}>
                <Avatar
                    rounded
                    size="large"
                    title={shortName}
                    activeOpacity={0.5}
                    containerStyle={{ marginVertical: 30 }}
                />
                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "400" }}>
                    {userInfo.FullName}
                </Text>
                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "400" }}>
                    {userInfo.PhoneNumber}
                </Text>
            </View>
            <QRCode
                value={valueForQRCode}
                size={250}
                bgColor="#000"
                fgColor="#fff"
                style={{ marginTop: 20, }}
            />
        </View>
    );
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

const QRCodeCom = connect(mapStateToProps, mapDispatchToProps)(QRCodeComponent);
export default QRCodeCom;

const styles = StyleSheet.create({

    containerQRCode: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
    },
    containerInfoUser: {
        width: "100%",
        height: 150,
        justifyContent: "center",
        marginVertical: 10,
        alignItems: "center",
        paddingBottom: 50,
    },

});