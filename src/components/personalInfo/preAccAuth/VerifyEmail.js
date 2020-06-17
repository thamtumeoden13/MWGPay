import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import { Button, Avatar } from 'react-native-elements';

const VerifyEmail = (props) => {

    const [state, setState] = useState('')

    const onChangeEmail = () => {
        if (props.onChangeEmail)
            props.onChangeEmail()
    }

    const onPreEmail = () => {
        if (props.onPreEmail)
            props.onPreEmail(state)
    }

    useEffect(() => {
        if (props.email)
            setState(props.email)
    }, [props.email])

    return (
        <React.Fragment>
            <View style={styles.containerSecurity}>
                <View style={{ height: 100, width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <View style={{ height: '100%', width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                        <Avatar
                            size="medium"
                            rounded
                            icon={{ name: 'email', type: 'entypo', color: '#ff3175f7' }}
                            overlayContainerStyle={{ backgroundColor: '#f1b7ca73' }}
                        />
                    </View>
                    <View style={{ height: '100%', width: '80%', flexDirection: 'column', justifyContent: 'center' }}>
                        <View style={{ width: '100%', marginVertical: 5 }}>
                            <Text style={{ fontSize: 18, textAlign: "left", fontWeight: 'bold', paddingLeft: 5 }}>
                                Xác thực địa chỉ email
                            </Text>
                        </View>
                        <View style={{ width: '100%', marginVertical: 5 }}>
                            <Text style={{ fontSize: 16, textAlign: "left", paddingLeft: 5, }}>
                                {state}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 50, width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button
                        type="clear"
                        title="Thay đổi Email"
                        status="success"
                        // containerStyle={{ width: 100 }}
                        onPress={() => onChangeEmail()}
                    />
                    <Button
                        title="Xác thực"
                        status="success"
                        containerStyle={{ width: 100 }}
                        onPress={() => onPreEmail()}
                    />
                </View>
            </View>
        </React.Fragment>
    );
}

export default VerifyEmail;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#eff1f4',
        paddingHorizontal: 5
    },
    containerSecurity: {
        width: '100%',
        height: 150,
        borderWidth: 1,
        backgroundColor: "#fff",
        borderColor: '#d2a1188c',
        borderRadius: 10,
        marginHorizontal: 10,
        marginTop: 10,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    containerTop: { flex: 1, flexDirection: 'row', marginVertical: 10, justifyContent: 'center', alignItems: 'center' },
    containerMiddleLeft: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    containerMiddleRight: { flex: 4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' },
    containerBottom: { flex: 3, width: '100%', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'flex-end' },
});