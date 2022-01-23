const axios = require('axios');
const fs = require('fs');
class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    get paramsMapBox () {

        return {
            access_token: 'pk.eyJ1IjoibHVpc3NhbGF6YXJpdHVycmEiLCJhIjoiY2t5cmhicXF6MHUydDJ2bnV5ZnJ1MXlkeCJ9.NQylurSITULDziOUds5i8w'
        }

    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        })
    }

    ciudades = async(lugar = '')=>{
        try {
            //peticion http

            //not working
            // const instance = axios.create({
            //     baseURL : `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
            //     params:{
            //         access_token: 'pk.eyJ1IjoibHVpc3NhbGF6YXJpdHVycmEiLCJhIjoiY2t5cmhicXF6MHUydDJ2bnV5ZnJ1MXlkeCJ9.NQylurSITULDziOUds5i8w'
            //     }
            // });

            //const resp = await instance.get();
  
            const resp = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?types=place%2Cpostcode%2Caddress&access_token=${process.env.MAP_BOX_KEY}`);

            //retornamos un objeto implicito
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            })
            )
    
        } catch (error) {
            return [];
        }
    }

    climaLugar = async(lat, lon)=>{
        try {
            //peticion http
  
            const resp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric&lang=es`);

            const {weather, main, id} = resp.data;
            return {
                    id,
                    desc: weather[0].description,
                    min: main.temp_min,
                    max: main.temp_max,
                    temp: main.temp
            }
    
        } catch (error) {
            return error;
        }
    }

    agregarHistorial(lugar = ''){

        if (this.historial.includes(lugar)) return;

        this.historial.unshift(lugar.toLowerCase);

        this.guardarDB();

    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){

        if (!fs.existsSync(this.dbPath)){
            return null;
        }
    
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
    
        const payload = JSON.parse(info);

        this.historial.push(...payload.historial);
    }

}

module.exports = Busquedas;