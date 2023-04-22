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
    displayRes();
  }
})

function fixEquation(equation) {
  var equationFixed = equation.slice(1, -1)
  var finalEquation = equationFixed.split(',')
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