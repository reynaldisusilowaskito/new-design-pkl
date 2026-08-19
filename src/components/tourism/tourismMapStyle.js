export const SURABAYA_CENTER=[112.7521,-7.2575]
export const SURABAYA_BOUNDS=[[112.58,-7.37],[112.90,-7.12]]
export const SURABAYA_MAP_STYLE={version:8,glyphs:'https://tiles.versatiles.org/assets/glyphs/{fontstack}/{range}.pbf',sources:{},layers:[{id:'background',type:'background',paint:{'background-color':'#101b2b'}}]}

export function addSurabayaVisualLayers(map){
  map.addSource('tourism-base',{type:'vector',tiles:['https://tiles.versatiles.org/tiles/osm/{z}/{x}/{y}'],minzoom:0,maxzoom:14,attribution:'© OpenStreetMap contributors'})
  map.addLayer({id:'tourism-ocean',type:'fill',source:'tourism-base','source-layer':'ocean',paint:{'fill-color':'#172b3d'}})
  map.addLayer({id:'tourism-water',type:'fill',source:'tourism-base','source-layer':'water_polygons',paint:{'fill-color':'#1c4053','fill-opacity':.92}})
  map.addLayer({id:'tourism-streets',type:'line',source:'tourism-base','source-layer':'streets',minzoom:10,paint:{'line-color':['interpolate',['linear'],['zoom'],10,'#425464',15,'#82909a'],'line-width':['interpolate',['linear'],['zoom'],10,.35,15,1.5],'line-opacity':.58}})
  map.addSource('tourism-districts',{type:'geojson',data:'/data/surabaya-kecamatan-2026.geojson',promoteId:'code'})
  map.addLayer({id:'tourism-district-fill',type:'fill',source:'tourism-districts',paint:{'fill-color':'#7ba9b5','fill-opacity':.2}})
  map.addLayer({id:'tourism-buildings',type:'fill-extrusion',source:'tourism-base','source-layer':'buildings',minzoom:12.5,paint:{'fill-extrusion-color':['interpolate',['linear'],['zoom'],12.5,'#536b78',15,'#e2c4c9'],'fill-extrusion-height':['interpolate',['linear'],['zoom'],12.5,2,15,18,17,28],'fill-extrusion-base':0,'fill-extrusion-opacity':.86}})
  map.addLayer({id:'tourism-district-line',type:'line',source:'tourism-districts',paint:{'line-color':'rgba(255,255,255,.72)','line-width':1}})
  map.addLayer({id:'tourism-district-label',type:'symbol',source:'tourism-districts',minzoom:11.4,layout:{'text-field':['get','name'],'text-font':['noto_sans_regular'],'text-size':['interpolate',['linear'],['zoom'],11.4,9,14,12],'text-letter-spacing':.05},paint:{'text-color':'#fff','text-halo-color':'rgba(19,31,48,.9)','text-halo-width':1.5}})
}
