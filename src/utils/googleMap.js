import React from 'react';
import mapBoxPolyline from '@mapbox/polyline';

export const getDirections = async (originLoc, destinationLoc) => {
    let isError = false;
    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${originLoc}&destination=${destinationLoc}&key=${"AIzaSyDKP-7YVHAuZPVXUkmfPGbio3C4EkQDhuQ"}`)
        // console.log('masuk fungsi resp', resp, `https://maps.googleapis.com/maps/api/directions/json?origin=${originLoc}&destination=${destinationLoc}&key=${"AIzaSyDKP-7YVHAuZPVXUkmfPGbio3C4EkQDhuQ"}`)
        let respJson = await resp.json();
        // console.log('masuk fungsi respJson', respJson)
        let points = await mapBoxPolyline.decode(respJson.routes[0].overview_polyline.points);
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
        // console.log('masuk fungsi', { coords, originAddress, destinationAddress, points, distance, duration })
        const result = { coords, originAddress, destinationAddress, points, distance, duration }
        return {
            result,
            isError
        }
    } catch (error) {
        // console.log('masuk fungsi error', error)
        isError = true
        const result = { error }
        return {
            result,
            isError
        }
    }
}

export const mergeLot = (latitude, longitude) => {
    if (latitude != null && longitude != null) {
        const concatLot = `"${latitude},${longitude}"`
        const concatLotDes = `"${cordLatitude},${cordLongitude}"`
        const coords = getDirections(concatLot, concatLotDes)
        return coords;
    }
}