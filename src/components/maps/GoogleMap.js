import React, { Fragment, useEffect, useState, useRef, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, UIManager, Linking, Platform, Dimensions, Alert, ActivityIndicator } from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polygon, Circle, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from 'react-native-permissions';
import mapBoxPolyline from '@mapbox/polyline';

import { API_GOOGLE_KEY } from '@constants/systemVars.js'
// import { ModalLoading } from '@componentsCommon/modal/ModalLoading';
// import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";

export const GoogleMap = (props) => {
    let _map = useRef()
    let watchId
    let mounted = true;
    const [direct, setDirect] = useState(props.direct ? props.direct : false)
    const [state, setState] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta: 0.035,
        longitudeDelta: 0.136,
        error: null,
        coords: [],
        concat: null,
        x: 'false',
        cordLatitude: null, //10.866278
        cordLongitude: null, //106.803218
        cordLatitudeDelta: 0.035,
        cordLongitudeDelta: 0.136,
        originAddress: props.originAddress ? props.originAddress : '',
        destinationAddress: props.destinationAddress ? props.destinationAddress : '',
        distance: { text: '0 km', value: 0 },
        duration: { text: '0 mins', value: 0 },
        isMapReady: false,
        isGeolocationReady: false
    })

    const [modal, setModal] = useState({
        isLoading: false,
    })

    const getDirections = async (originLoc, destinationLoc) => {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${originLoc}&destination=${destinationLoc}&key=${API_GOOGLE_KEY}`)
            // console.log('masuk fungsi resp', resp, `https://maps.googleapis.com/maps/api/directions/json?origin=${originLoc}&destination=${destinationLoc}&key=${API_GOOGLE_KEY}`)
            let respJson = await resp.json();
            // console.log('masuk fungsi respJson', respJson)
            let points = mapBoxPolyline.decode(respJson.routes[0].overview_polyline.points);
            // console.log('masuk fungsi points', points)
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            const originAddress = respJson.routes[0].legs[0].start_address
            const destinationAddress = respJson.routes[0].legs[0].end_address
            const distance = respJson.routes[0].legs[0].distance
            const duration = respJson.routes[0].legs[0].duration
            setState({ ...state, coords: coords, x: "true", originAddress, destinationAddress, distance, duration })
            // console.log('masuk fungsi', resp, respJson, points, coords)
            return coords
        } catch (error) {
            // console.log('masuk fungsi error', error)
            setState({ ...state, x: "error" })
            return error
        }
    }

    const getGeoCoding = async (code) => {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(code)}&key=${API_GOOGLE_KEY}`)
            // console.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(code)}&key=${key}`)
            // console.log('getGeoCodingResp', resp)
            let respJson = await resp.json();
            // console.log('getGeoCoding respJson', respJson)
            if (respJson.results.length > 0) {
                const location = await respJson.results[0].geometry.location;
                const addressComponent = respJson.results[0].address_components;
                const formattedAddress = respJson.results[0].formatted_address;
                // console.log({ location, formattedAddress, addressComponent })
                setState({ ...state, cordLatitude: location.lat, cordLongitude: location.lng })
            }
        } catch (error) {
            // console.log('masuk fungsi error', error)
            setState({ ...state, x: "error" })
            return error
        }
    }

    const mergeLot = () => {
        if (!!state.latitude && !!state.longitude && !!state.cordLatitude && !!state.cordLongitude) {
            const concatLot = `${state.latitude},${state.longitude}`
            const concatLotDes = `${state.cordLatitude},${state.cordLongitude}`
            setState({ ...state, concat: concatLot })
            if (!!state.cordLatitude && !!state.cordLongitude) {
                getDirections(concatLot, concatLotDes)
            }
            else {
                Alert.alert(
                    'Lỗi chỉ đường',
                    'Chưa có điểm đến! vui lòng chọn điểm đến trên bản đồ',
                    [
                        {
                            text: 'Đồng ý'
                        }
                    ],
                    { cancelable: false })
            }
        }
    }

    const onEvent = event => {
        if (mounted && state.isMapReady && state.x == 'true') {
            if (_map && _map.map) {
                _map.animateToRegion({
                    latitude: event.coords.latitude,
                    longitude: event.coords.longitude,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.035,
                }, 500)
            }
        }
    };

    const localCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                // console.log(position, state.cordLatitude, state.cordLongitude)
                setState({
                    ...state,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.035,
                    isGeolocationReady: true,
                    error: null,
                });
            },
            (error) => {
                // console.log(error)
                setState({
                    ...state,
                    isGeolocationReady: false,
                    error: error,
                });
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const requestLocationPermission = async () => {
        setModal({ ...modal, isLoading: true });
        if (Platform.OS === 'ios') {
            const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (response === 'granted') {
                localCurrentPosition()
            }
        }
        else {
            const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (response === 'granted') {
                localCurrentPosition()
            }
        }
    }

    const onMakerPress = (e) => {
        console.log("onMakerDesPress", e)
    }

    const onMapViewPress = (e) => {
        const { latitude: cordLatitude, longitude: cordLongitude } = e.nativeEvent.coordinate
        setState({
            ...state, cordLatitude, cordLongitude,
            coords: [], x: 'false',
            distance: { text: '0 km', value: 0 },
            duration: { text: '0 mins', value: 0 },
        })
        if (_map && _map.map) {
            _map.animateToRegion({
                latitude: cordLatitude,
                longitude: cordLongitude,
                latitudeDelta: state.cordLatitudeDelta,
                longitudeDelta: state.cordLongitudeDelta
            }, 1500)
        }
    }

    const onMapReady = () => {
        if (state.isGeolocationReady) {
            if (!!state.cordLatitude && !!state.cordLongitude) {
                _map.animateToRegion({
                    latitude: state.cordLatitude,
                    longitude: state.cordLongitude,
                    latitudeDelta: state.cordLatitudeDelta,
                    longitudeDelta: state.cordLongitudeDelta
                }, 1500)
            }
            else {
                _map.animateToRegion({
                    latitude: state.latitude,
                    longitude: state.longitude,
                    latitudeDelta: state.latitudeDelta,
                    longitudeDelta: state.longitudeDelta
                }, 1500)
            }
        }
        setState({ ...state, isMapReady: true })
    }

    useLayoutEffect(() => {
        requestLocationPermission()
    }, [])

    useEffect(() => {
        watchId = Geolocation.watchPosition(onEvent);
        return () => {
            mounted = false;
            Geolocation.clearWatch(watchId);
        }
    })

    useEffect(() => {
        mergeLot();
    }, [props.direct])

    useEffect(() => {
        if (props.destinationLoc && props.destinationLoc.length > 0) {
            const array = props.destinationLoc.split(',');
            if (array.length > 0) {
                const cordLatitude = parseFloat(array[0])
                const cordLongitude = parseFloat(array[1])
                setState({
                    ...state,
                    cordLatitude: cordLatitude,
                    cordLongitude: cordLongitude,
                    destinationAddress: props.destinationAddress
                })
            }
        }
        else {
            if (props.destinationAddress && props.destinationAddress.length > 0) {
                getGeoCoding(props.destinationAddress)
            }
        }
    }, [props.destinationLoc, props.destinationAddress])


    useEffect(() => {
        setState({ ...state, coords: [], x: 'false' })
        if (state.cordLatitude && state.cordLongitude && _map && _map.map) {
            _map.animateToRegion({
                latitude: state.cordLatitude,
                longitude: state.cordLongitude,
                latitudeDelta: 0.009,
                longitudeDelta: 0.035,
            }, 1500)
        }
    }, [state.cordLatitude, state.cordLongitude])

    useEffect(() => {
        if (state.x == 'true') {
            if (_map && _map.map) {
                _map.animateToRegion({
                    latitude: state.latitude,
                    longitude: state.longitude,
                    latitudeDelta: state.latitudeDelta,
                    longitudeDelta: state.longitudeDelta
                }, 1500)
            }
            if (props.changeRouter) {
                props.changeRouter(state.distance, state.duration)
            }
        }
    }, [state.x])

    useEffect(() => {
        if (props.changeRouter) {
            props.changeRouter(state.distance, state.duration)
        }
    }, [state.distance, state.duration])

    useEffect(() => {
        if (!!state.error)
            setTimeout(() => {
                Alert.alert("Lỗi call api", state.error.message)
            }, 200);
    }, [state.error])

    // useEffect(() => {
    //     const isLoading = !!state.isMapReady && (!!state.isGeolocationReady || !!state.error)
    //     setModal({ ...modal, isLoading: !isLoading })
    //     console.log(isLoading, !!state.isMapReady, !!state.isGeolocationReady, !!state.error)
    // }, [state.isMapReady, state.isGeolocationReady, state.error])

    return (
        <View style={styles.container}>
            {/* <View style={styles.map}>
                <ModalLoading
                    isVisible={modal.isLoading}
                />
            </View> */}
            {!!state.latitude && !!state.longitude &&
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    ref={map => _map = map}
                    showsUserLocation
                    style={styles.map}
                    initialRegion={{
                        latitude: state.latitude,
                        longitude: state.longitude,
                        latitudeDelta: state.latitudeDelta,
                        longitudeDelta: state.longitudeDelta
                    }}
                    showsMyLocationButton={true}
                    zoomEnabled={true}
                    zoomTapEnabled={true}
                    zoomControlEnabled={true}
                    cacheEnabled={true}
                    loadingEnabled={true}
                    loadingBackgroundColor="transparent"
                    loadingIndicatorColor="#f0f"
                    onPress={e => onMapViewPress(e)}
                    onMapReady={() => onMapReady()}
                >
                    {!!state.cordLatitude && !!state.cordLongitude &&
                        <Marker
                            coordinate={{ "latitude": state.cordLatitude, "longitude": state.cordLongitude }}
                            onPress={(e) => onMakerPress(e)}
                        >
                            <Callout>
                                <Text style={{ maxWidth: 200, maxHeight: 200, textAlign: 'justify' }}>{state.destinationAddress}</Text>
                            </Callout>
                        </Marker>
                    }
                    {!!state.latitude && !!state.longitude && state.x == 'true' &&
                        <Polyline
                            coordinates={state.coords}
                            strokeWidth={6}
                            strokeColor="#669df6"
                        />
                    }
                    {!!state.latitude && !!state.longitude && (state.x == 'error') &&
                        <Polyline
                            coordinates={[
                                { latitude: state.latitude, longitude: state.longitude },
                                { latitude: state.cordLatitude, longitude: state.cordLongitude },
                            ]}
                            strokeWidth={6}
                            strokeColor="#669df6"
                        />
                    }
                </MapView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        // height: '50%'
    },
});