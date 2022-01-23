const { green } = require('colors');
const inquirer = require('inquirer');
require('colors');

const opts = [
    {
        type: 'list',
        name: 'option',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1'.green}. Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2'.green}. Historial`
            },
            {
                value: 0,
                name: `${'0'.green}. Salir`
            }
    ]
}
];

const inquiereMenu = async() => {
    console.clear('');
    console.log('============================='.green);
    console.log('    Seleccione una Opción'.green);
    console.log('=============================\n'.green);

    const {option} = await inquirer.prompt(opts);
    return option;
}

const pausa = async() =>{
    const optionsPause = [
        {
            type: 'input',
            name: 'option',
            message: `Presione ${'ENTER'.green} para Continuar`
        }
    
    ];
    await inquirer.prompt(optionsPause);
}

const leerInput = async( message ) =>{
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    
    ];
    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async(lugares = []) =>{

    const choices = lugares.map((lugar,i) =>{
        const idx = `${i+1}`.green;
        return {
            value : lugar.id,
            name :`${idx} ${lugar.nombre}`
        }
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: '¿Seleccione lugar?',
            choices
    }
    ];

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const {id} = await inquirer.prompt(preguntas);
    return id;

}

const listadoTareasCheckList = async(tareas = []) =>{

    const choices = tareas.map((t,i) =>{
        const idx = `${i+1}.`.green;
        return {
            value : t.id,
            name :`${idx} ${t.desc}`,
            checked: t.completadoEn ? true : false
        }
    })

    // choices.unshift({
    //     value: '0',
    //     name: '0.'.green + ' Cancelar'
    // });

    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
    }
    ];

    const {ids} = await inquirer.prompt(preguntas);
    return ids;

}

module.exports = {
    inquiereMenu, pausa, leerInput, listarLugares,listadoTareasCheckList
}