export const hereCredentials = {
    id: 'cUVdAqlcRifq41vNf4e7',
    code: 'efum7QJB2rmktIcMTDK0nQ'
 }
 
 export const hereIsolineUrl = (coords, options) => `https://isoline.route.api.here.com/routing/7.2/calculateisoline.json?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&mode=fastest;${options.mode};traffic:${options.traffic}&destination=geo!${coords[0]},${coords[1]}&range=${options.range}&rangetype=${options.type}&arrival=${options.time}`
 
 export const hereTileUrl = (style) => `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&ppi=320`;
 
 export const maxIsolineRangeLookup = {
    time: 20000,
    distance: 400000
 }