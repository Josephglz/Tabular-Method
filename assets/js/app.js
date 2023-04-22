var btnStepOne = document.getElementById('btnStepOne');
var btnStepTwo = document.getElementById('btnStepTwo');
var contFirst = document.getElementById('ContFirstAnim');
var contentInputs = document.getElementById('contentInputs');
var ContTruth = document.getElementById('ContTruth');
var contTruthTable = document.getElementById('ContTruthTable');
var equationInput = document.getElementById('equation_input');
var ResCont = document.getElementById('ResCont');

numVariables.addEventListener('change', function () {
    contentInputs.classList.add('slide-left');
    if (document.getElementById('numVariables').value > 0 && document.getElementById('numVariables').value <= 6) {

        equationInput.classList.remove('hidden');
        equationInput.classList.add('flex');
        contNumBarAnim();
        contEcuationAnim();
    } else {
        alert('Por favor seleccione un número de variables válido');
    }
});

btnStepTwo.addEventListener('click', function () {
    if (document.getElementById('equation').value != '') {
        var salidas = fixEquation(document.getElementById('equation').value)

        const truthTable = generateTruthTable(document.getElementById('numVariables').value, salidas);
        contTruthTableAnim();

        displayTruthTable(truthTable);

        groupTerms(truthTable);
        var PrimosEsenciales = findEssentialPrimeImplicants(truthTable, salidas);
        simplifyBooleanExpression(PrimosEsenciales);
        var simplificadas = simplifyExpression(PrimosEsenciales);
        var variables = []
        for(var i = 0; i < document.getElementById('numVariables').value; i++){
            variables.push(truthTable[0][i])
        }
        var resultado = generateSimplifiedExpression(simplificadas, variables)
        console.log(resultado)
        simplifyExpression(PrimosEsenciales, variables);
        displayRes();
    }
})

function simplifyExpression(groups, variables) {
    let expression = "";
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (group.length === 0) {
        continue;
      }
      for (let j = 0; j < group.length; j++) {
        const term = group[j];
        for (let k = 0; k < term.length; k++) {
          const bit = term[k];
          const variable = variables[k];
          if (bit === "0") {
            expression += `!${variable}`;
          } else if (bit === "1") {
            expression += variable;
          }
        }
        if (j < group.length - 1) {
          expression += " + ";
        }
      }
      if (i < groups.length - 1) {
        expression += " + ";
      }
    }
    return expression;
  }
  


function generateSimplifiedExpression(groups, variables) {
    const expressions = [];
    for (const group of groups) {
      const variablesInGroup = group.map(i => variables[i]);
      expressions.push(`(${variablesInGroup.join(' + ')})`);
    }
    return expressions.join(' * ');
  }
  

function fixEquation(equation) {
    var equationFixed = equation.slice(1, -1)
    var finalEquation = equationFixed.split(',')
    if (document.getElementById('numVariables').value == 1 && finalEquation.length > 2) {
        alert('Por favor ingrese una ecuación válida')
        return
    } else if (document.getElementById('numVariables').value == 2 && finalEquation.length > 4) {
        alert('Por favor ingrese una ecuación válida')
        return
    } else if (document.getElementById('numVariables').value == 3 && finalEquation.length > 8) {
        alert('Por favor ingrese una ecuación válida')
        return
    } else if (document.getElementById('numVariables').value == 4 && finalEquation.length > 16) {
        alert('Por favor ingrese una ecuación válida')
        return
    } else if (document.getElementById('numVariables').value == 5 && finalEquation.length > 32) {
        alert('Por favor ingrese una ecuación válida')
        return
    } else if (document.getElementById('numVariables').value == 6 && finalEquation.length > 64) {
        alert('Por favor ingrese una ecuación válida')
        return
    }

    return finalEquation
}

function generateTruthTable(numVariables, outputs) {
    const rows = Math.pow(2, numVariables);
    const table = [];

    const salidas = outputs.map(str => {
        return Number(str);
    });

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = numVariables - 1; j >= 0; j--) {
            row.push((i >> j) & 1);
        }
        const outputIndex = salidas.indexOf(i);
        const outputValue = outputIndex >= 0 ? 1 : 0;
        row.push(outputValue);
        table.push(row);
    }
    return table;
}

function groupTerms(terms) {
    const groups = {};
    for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        const numberOfOnes = term.filter(bit => bit === 1).length;
        if (!groups[numberOfOnes]) {
            groups[numberOfOnes] = [];
        }
        groups[numberOfOnes].push(term);
    }
    return groups;
}

function findEssentialPrimeImplicants(groups, outputs) {
    const essentialPrimeImplicants = [];

    // Recorrer cada grupo
    groups.forEach((group) => {
        // Recorrer cada implicante en el grupo
        group.forEach((implicant) => {
            let isEssential = true;
            let essentialOutput = -1;

            // Verificar si el implicante es esencial
            implicant.outputs.forEach((output) => {
                if (outputs[output] === 1) {
                    // Verificar que no haya otro implicante en el mismo grupo
                    group.forEach((otherImplicant) => {
                        if (otherImplicant !== implicant && otherImplicant.outputs.includes(output)) {
                            isEssential = false;
                        }
                    });

                    // Verificar que no haya otro implicante en otro grupo
                    if (isEssential) {
                        for (let i = 0; i < groups.length; i++) {
                            if (groups[i] !== group) {
                                for (let j = 0; j < groups[i].length; j++) {
                                    if (groups[i][j].outputs.includes(output)) {
                                        isEssential = false;
                                        break;
                                    }
                                }
                            }
                            if (!isEssential) break;
                        }
                    }

                    // Si es esencial, agregarlo al arreglo de términos primos esenciales
                    if (isEssential) {
                        essentialOutput = output;
                    }
                }
            });

            if (essentialOutput !== -1) {
                essentialPrimeImplicants.push({
                    inputs: implicant.inputs,
                    outputs: [essentialOutput]
                });
            }
        });
    });

    return essentialPrimeImplicants;
}

function simplifyBooleanExpression(primeImplicants) {
    let expression = '';

    for (let i = 0; i < primeImplicants.length; i++) {
        const ones = [];
        let term = '';

        // Obtener los índices de los bits que están en estado 1
        for (let j = 0; j < primeImplicants[i].length; j++) {
            if (primeImplicants[i][j] === 1) {
                ones.push(j);
            }
        }

        // Crear la cadena que representa el término implicante
        for (let j = 0; j < ones.length; j++) {
            if (j === 0) {
                term += variablesLetter[ones[j]];
            } else {
                term += `'${variablesLetter[ones[j]]}`;
            }
        }

        // Agregar el término a la expresión
        if (expression === '') {
            expression += term;
        } else {
            expression += ` + ${term}`;
        }
    }

    return expression;
}

function simplifyExpression(groups, variables) {
    let expression = '';
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group.length === 0) {
            continue;
        }
        for (let j = 0; j < group.length; j++) {
            const term = group[j];
            let termStr = '';
            for (let k = 0; k < term.length; k++) {
                const bit = term[k];
                if (bit === '0') {
                    termStr += `${variables[k]}'`;
                } else if (bit === '1') {
                    termStr += `${variables[k]}`;
                }
            }
            if (expression !== '' && termStr !== '') {
                expression += ' + ';
            }
            expression += termStr;
        }
    }
    if (expression === '') {
        expression = '0';
    }
    return expression;
}


const variablesLetter = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G'
}

function displayTruthTable(truthTable) {
    const tableElement = document.createElement('table');
    tableElement.classList.add('bg-zinc-100', 'border-collapse', 'border', 'border-zinc-200', 'rounded', 'shadow', 'text-zinc-700', 'w-1/2', 'relative');
    tableElement.id = 'tableTarget';
    // Crear encabezado
    const headerRow = document.createElement('tr');
    headerRow.classList.add('border-b', 'border-zinc-300', 'text-center', 'text-zinc-700', 'text-sm', 'group', 'fixed', 'top-0');
    for (let i = 0; i < truthTable[0].length; i++) {
        const headerCell = document.createElement('th');
        if (i === truthTable[0].length - 1) {
            headerCell.textContent = "S";
        } else {
            headerCell.textContent = `${variablesLetter[i]}`;
        }
        headerCell.classList.add('border-r', 'border-zinc-300', 'p-2', 'text-center', 'group-hover:bg-zinc-900');
        headerRow.appendChild(headerCell);
    }
    tableElement.appendChild(headerRow);

    // Crear filas de datos
    for (let i = 0; i < truthTable.length; i++) {
        const dataRow = document.createElement('tr');
        dataRow.classList.add('border', 'border-b-4', 'border-zinc-300', 'text-center', 'text-sm', 'group', 'bg-zinc-100');
        for (let j = 0; j < truthTable[i].length; j++) {
            const dataCell = document.createElement('td');
            dataCell.classList.add('border', 'border-r-4', 'border-zinc-300', 'p-2', 'group-hover:bg-zinc-900');
            dataCell.textContent = truthTable[i][j];
            dataRow.appendChild(dataCell);
        }
        tableElement.appendChild(dataRow);
    }

    contTruthTable.appendChild(tableElement);
}

function displayRes() {
    const lblSimplify = document.createElement('label');
    lblSimplify.setAttribute = 'simpRes';
    lblSimplify.textContent = 'Resultado de la simplificación';

    const inputSimplify = document.createElement('input');
    inputSimplify.type = 'text';
    inputSimplify.id = 'simpRes';
    inputSimplify.classList.add('w-96', 'mb-4', 'bg-gray-50', 'border', 'border-gray-300', 'text-gray-900', 'text-sm', 'rounded-lg', 'focus:ring-blue-500', 'focus:border-blue-500', 'block', 'p-2.5');
    inputSimplify.placeholder = 'Resultado';
    inputSimplify.required = true;
    inputSimplify.disabled = true;

    ResCont.appendChild(lblSimplify);
    ResCont.appendChild(inputSimplify);
}

function contTruthTableAnim() {

    ContTruth.animate(
        [
            { opacity: 0 },
            { opacity: 1 }
        ],
        {
            duration: 1000,
            easing: 'ease-in-out',
            iterations: 1,
            direction: 'alternate',
            fill: 'forwards'
        }
    );
}

function contNumBarAnim() {

    contFirst.animate(
        [
            { transform: 'translateY(0rem)' },
            { transform: 'translateY(0rem)' }
        ],
        {
            duration: 1000,
            easing: 'ease-in-out',
            iterations: 1,
            direction: 'alternate',
            fill: 'forwards'
        }
    );
}

function contEcuationAnim() {
    equationInput.animate(
        [
            { opacity: 0, zIndex: 1000 },
            { opacity: 1, zIndex: 1000 }
        ],
        {
            duration: 1000,
            easing: 'ease-in-out',
            iterations: 1,
            direction: 'alternate',
            fill: 'forwards'
        }
    );
}

/**
 * 
 * 
arregloBITS = []
for(var i = 0; i < output.length; i++){
    arregloBITS.push(tabla[output[i]])
}

var cont = 0
for(var i = 0; i < arregloBITS.length; i++) {
    cont = 0
    for(var j = 0; j < arregloBITS[i].length; j++) {
        if(arregloBITS[i][j] == 1) {
            cont++
        }
    }
    console.log('En linea ' + i + 'Hay: ' + cont)
}
 */