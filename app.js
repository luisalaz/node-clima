require('dotenv').config()

const { leerInput, inquiereMenu, pausa, listarLugares } = require("./helpers/inquierer");
const Busquedas = require("./models/busquedas");

const main = async()=>{

    const busquedas = new Busquedas();
    let opt = 0;
    do{
        opt = await inquiereMenu();
        
        switch(opt){

            case 1:
                //mostrar mensaje
                const lugar = await leerInput('Ciudad: ');

                //buscar lugares
                const lugares = await busquedas.ciudades(lugar);

                //seleccionar lugar
                const idLugar = await listarLugares(lugares);

                if (idLugar === '0') continue;
                
                const lugarSel =lugares.find(l=>l.id === idLugar);
                //guardamos lugar en bd
                busquedas.agregarHistorial(lugarSel.nombre);

                //obtiene clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                
                //mostramos info al cliente
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green );
                console.log('Lat:', lugarSel.lat );
                console.log('Lng:', lugarSel.lng );
                console.log('Temp:', clima.temp );
                console.log('Min:', clima.min );
                console.log('Max:', clima.max );
                console.log('Como esta el clima:', clima.desc.green );

            break;

            case 2:
                console.log('\nHISTORIAL'.green);
                busquedas.historialCapitalizado.forEach((lugar, i) =>{
                    let idx = `${i +1}`.green;
                    console.log(`${idx} ${lugar}`);
                })
                console.log('\n');
                
            break;

        }

        if (opt !==0) await pausa();

    }while(opt !== 0);

}

main();