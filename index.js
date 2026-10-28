/**
 * Simulador de Cajero Automático - Algoritmo Greedy
 * Autor: Franklin Tinoco
 * Descripción: Programa CLI en Node.js para calcular el cambio óptimo de billetes 
 * utilizando el enfoque voraz (Greedy) y validaciones robustas.
 */

const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

// Denominaciones de billetes disponibles ordenadas de mayor a menor (Enfoque Greedy)
const DENOMINACIONES = [1000, 500, 200, 100];

/**
 * Función independiente que implementa el Algoritmo Greedy para el cálculo de billetes.
 * Selecciona siempre la denominación más grande posible en cada paso.
 * @param {number} monto - Cantidad de dinero solicitada por el usuario.
 * @returns {Object} Objeto con el desglose de billetes, total de billetes y monto despachado.
 */
function calcularBilletes(monto) {
    let dineroRestante = monto;
    const desglose = {};
    let totalBilletes = 0;

    for (const billete of DENOMINACIONES) {
        if (dineroRestante >= billete) {
            // Cantidad entera de billetes que se pueden entregar de esta denominación
            const cantidad = Math.floor(dineroRestante / billete);
            desglose[billete] = cantidad;
            totalBilletes += cantidad;
            
            // Actualizamos el dinero restante usando el módulo
            dineroRestante %= billete;
        } else {
            desglose[billete] = 0;
        }
    }

    return {
        desglose,
        totalBilletes,
        dineroDespachado: monto - dineroRestante,
        dineroRestante
    };
}

/**
 * Valida que la entrada del usuario sea un número entero positivo y múltiplo de 100.
 * @param {string} inputStr - Texto ingresado por la terminal.
 * @returns {Object} Resultado de la validación { esValido: boolean, mensaje: string, valor: number }
 */
function validarEntrada(inputStr) {
    // Verificar si está vacío o contiene espacios en blanco
    if (!inputStr || inputStr.trim() === '') {
        return { esValido: false, mensaje: 'Error: El campo no puede estar vacío.' };
    }

    // Verificar si es un número válido (rechaza texto, caracteres especiales, etc.)
    const numero = Number(inputStr);
    if (isNaN(numero)) {
        return { esValido: false, mensaje: 'Error: Debe ingresar un valor numérico válido (no se permite texto).' };
    }

    // Verificar si contiene decimales
    if (!Number.isInteger(numero)) {
        return { esValido: false, mensaje: 'Error: No se permiten cantidades decimales.' };
    }

    // Verificar si es negativo o cero
    if (numero <= 0) {
        return { esValido: false, mensaje: 'Error: El monto debe ser un número entero positivo mayor a cero.' };
    }

    // Verificar si es múltiplo de la denominación menor disponible (100)
    if (numero % 100 !== 0) {
        return { esValido: false, mensaje: `Error: El monto debe ser múltiplo de 100 (denominación menor disponible).` };
    }

    return { esValido: true, valor: numero };
}

/**
 * Función principal para gestionar la interfaz de usuario en la terminal (CLI).
 */
async function main() {
    const rl = readline.createInterface({ input, output });

    console.log('==================================================');
    console.log('     BIENVENIDO AL SIMULADOR DE CAJERO AUTOMÁTICO');
    console.log('           (Algoritmo Greedy / Billetes)');
    console.log('==================================================\n');

    let continuar = true;

    while (continuar) {
        const respuesta = await rl.question('Ingrese la cantidad de dinero a retirar (o escriba "SALIR"): ');

        // Permitir salir del programa
        if (respuesta.trim().toUpperCase() === 'SALIR') {
            console.log('\nGracias por utilizar el Cajero Automático. ¡Hasta pronto!');
            break;
        }

        // Validar la entrada
        const validacion = validarEntrada(respuesta);
        if (!validacion.esValido) {
            console.log(`\n❌ ${validacion.mensaje}\n`);
            continue;
        }

        const montoSolicitado = validacion.valor;

        // Ejecutar el Algoritmo Greedy
        const resultado = calcularBilletes(montoSolicitado);

        // Mostrar resultados organizados en consola
        console.log('\n--------------------------------------------------');
        console.log(`📌 MONTO SOLICITADO: C$ ${montoSolicitado.toLocaleString()}`);
        console.log('--------------------------------------------------');
        console.log('Desglose óptimo de billetes:');

        for (const billete of DENOMINACIONES) {
            const cantidad = resultado.desglose[billete];
            if (cantidad > 0) {
                const etiquetaBillete = cantidad === 1 ? 'billete' : 'billetes';
                console.log(`  * ${cantidad} ${etiquetaBillete} de C$ ${billete}`);
            }
        }

        console.log('--------------------------------------------------');
        console.log(`📦 Total de billetes entregados: ${resultado.totalBilletes}`);
        console.log(`💵 Dinero despachado: C$ ${resultado.dineroDespachado.toLocaleString()}`);
        console.log(`⚠️ Dinero restante: C$ ${resultado.dineroRestante}`);
        console.log('--------------------------------------------------\n');

        // Preguntar si desea realizar otra transacción
        const otra = await rl.question('¿Desea realizar otro retiro? (s/n): ');
        if (otra.trim().toLowerCase() !== 's' && otra.trim().toLowerCase() !== 'si') {
            console.log('\nGracias por utilizar el Cajero Automático. ¡Hasta pronto!');
            continuar = false;
        } else {
            console.log('\n==================================================\n');
        }
    }

    rl.close();
}

// Ejecutar el programa
main();