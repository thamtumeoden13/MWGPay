import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements';

export const SignInButton = (props) => {

    const [isLoading, setIsLoading] = useState(props.isLoading ? props.isLoading : false)

    const onPress = () => {
        if (props.onPress)
            props.onPress()
    }

    useEffect(() => {
        setIsLoading(props.isLoading)
    }, [props.isLoading])

    return (
        <View>
            <Button
                title={props.title}
                activeOpacity={1}
                underlayColor="transparent"
                onPress={onPress}
                loadingProps={{
                    size: 'large',
                    color: '#000',
                    hidesWhenStopped: true,
                }}
                buttonStyle={{
                    height: 50,
                    width: 150,
                    backgroundColor: '#ffee00',
                    borderWidth: 2,
                    borderColor: 'rgba(171, 189, 219, 1)',
                    borderRadius: 10,
                }}
                containerStyle={{ marginTop: 35, marginBottom: 20 }}
                titleStyle={{ fontWeight: '600', color: '#288ad6' }}
            />
        </View>
    )
}