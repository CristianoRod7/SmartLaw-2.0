import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '500px',
  borderRadius: '2.5rem'
};

const center = { lat: 37.5559, lng: 126.9723 };

const MapViewer = ({ workCoords, results, setSelectedPlace }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // 🚀 검색하거나 리스트 클릭 시 지도를 해당 위치로 부드럽게 이동
  useEffect(() => {
    if (map && workCoords) {
      map.panTo(workCoords);
      map.setZoom(15);
    }
  }, [map, workCoords]);

  if (!isLoaded) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-[2.5rem]" />;

  return (
    <div className="h-full shadow-2xl shadow-blue-100 border-8 border-white rounded-[3rem] overflow-hidden relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={workCoords || center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [ // 지도 스타일을 깔끔하게 (Silver 테마 추천)
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
          ]
        }}
      >
        {/* 1. 직장 마커 */}
        {workCoords && (
          <Marker 
            position={workCoords} 
            label={{ 
              text: "MY WORK", 
              className: "bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg mb-10 border-2 border-white" 
            }}
          />
        )}

        {/* 2. 추천 주거지 마커들 */}
        {results && results.map((place) => (
          <Marker 
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => setSelectedPlace(place)}
            label={{ 
              text: `${place.name}`, 
              className: "bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg border-2 border-white" 
            }}
          />
        ))}
      </GoogleMap>
      
      {/* 지도 위 플로팅 뱃지 */}
      <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm text-[10px] font-black text-slate-400 border border-white">
        POWERED BY NEXTLAW 2.0 ENGINE
      </div>
    </div>
  );
};

export default MapViewer;