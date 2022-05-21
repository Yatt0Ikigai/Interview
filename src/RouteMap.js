// src/DisplayMapFC.js

import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import {PlatformContext} from "./PlatformContext";
import {useSearchParams} from "react-router-dom";
import TravelingInfo from "./TravelingInfo";


export default function RouteMap ({origin, destination}){
    const mapRef = React.useRef(null);
    const {H, Platform: platform} = React.useContext(PlatformContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const originLat = searchParams.get("originLat")
    const originLng = searchParams.get("originLng")
    const destinationLat = searchParams.get("destinationLat")
    const destinationLng = searchParams.get("destinationLng")
    const [distance,setDistance] = useState(0)
    const [path,setPath] = useState([])

    async function calculateRouteFromAtoB(hMap) {
        const router = platform.getRoutingService(null, 8),
            routeRequestParams = {
                routingMode: 'fast',
                transportMode: 'car',
                origin: originLat + "," + originLng,
                destination: destinationLat + "," + destinationLng,
                return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
            };

        const onResult = function(result) {
            if (result.routes.length) {
                setDistance(result.routes[0].sections[0].travelSummary.length / 1000)
                setPath(result.routes[0].sections[0].actions)
                result.routes[0].sections.forEach((section) => {
                    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
                    let routeLine = new H.map.Polyline(linestring, {
                        style: { strokeColor: 'blue', lineWidth: 3 }
                    });
                    let startMarker = new H.map.Marker(section.departure.place.location);
                    let endMarker = new H.map.Marker(section.arrival.place.location);
                    hMap.addObjects([routeLine, startMarker, endMarker]);
                    hMap.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
                });
            }
        };

        const data = await router.calculateRoute(
            routeRequestParams,
            onResult
        );
        return data
    }

    useEffect(() => {
        if (!mapRef.current) return;
        const defaultLayers = platform.createDefaultLayers();
        const hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
            center: { lat: originLat , lng: originLng},
            zoom: 10,
            pixelRatio: window.devicePixelRatio || 1
        });
        calculateRouteFromAtoB(hMap)
        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));
        const ui = H.ui.UI.createDefault(hMap, defaultLayers);

        return () => {
            hMap.dispose();
        };
    }, [mapRef,originLat, originLng,destinationLng,destinationLat]);

    return(
        <div>
            <div className="map" ref={mapRef} style={{height:"100vh"}}/>
            <TravelingInfo distance={distance} path={path}/>
        </div>
    );
};