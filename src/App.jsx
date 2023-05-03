import { useState } from 'react';
import { buttons } from './utils/buttons';
import { MODES } from './utils/modes';
import Button from './Button';
import ChangeStyle from './ChangeStyle';
import {
  endsWithNegativeSign,
  endsWithOperator,
  isOperator,
} from './utils/validator';
import './styles/App.css';

function App() {
  const [formula, setFormula] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [prevValue, setPrevValue] = useState('0');
  const [evaluate, setEvaluate] = useState(false);

  const [mode, setMode] = useState(MODES.purple);

  /**
   * Función para los números
   */
  function handlerNumber({ target: { innerText } }) {
    setEvaluate(false);
    if (evaluate) {
      setCurrentValue(innerText);
      setFormula(innerText !== '0' ? innerText : '');
    } else {
      setCurrentValue(
        currentValue === '0' || isOperator.test(currentValue)
          ? innerText
          : currentValue + innerText
      );
      setFormula(
        currentValue === '0' && innerText === '0'
          ? formula === ''
            ? innerText
            : formula
          : // Si la formula es '0' o si hay un '0' luego de un operador
          // Ej: 12 - 0, 12 * 0
          /([^.0-9]0|^0)$/.test(formula)
          ? formula.slice(0, -1) + innerText
          : formula + innerText
      );
    }
  }

  /**
   * Función para el punto decimal
   */
  function handlerDecimal() {
    if (evaluate) {
      setCurrentValue('0.');
      setFormula('0.');
      setEvaluate(false);
    } else {
      // Si el currentValue no contiene un punto "."
      if (!currentValue.includes('.')) {
        if (
          // Si termina en operador (+,-,/,*)
          // o si el currentValue es 0 y la formula esta vacia
          endsWithOperator.test(formula) ||
          (currentValue === '0' && formula === '')
        ) {
          setCurrentValue('0.');
          setFormula(formula + '0.');
        } else {
          // Con el match se obtiene el ultimo valor de la formula
          // luego del operador
          setCurrentValue(formula.match(/(\d+\d*)$/)[0] + '.');
          setFormula(formula + '.');
        }
      }
    }
  }

  /**
   * Función que evalùa la formula y da la respuesta
   */
  function handlerEqual() {
    // Si ya se evaluó o si la formula termina en operador
    // no se hace nada
    if (evaluate || endsWithOperator.test(formula)) return;

    let result = '';

    try {
      // Si es el resultado de eval() es undefined entonces
      // retorna un NaN
      result = eval(formula) ?? NaN;
    } catch (error) {
      // Si hay error no hace nada
      return;
    }

    setCurrentValue(result);
    setPrevValue(result);
    setFormula(
      isFinite(result) || isNaN(result) ? formula + '=' + result : result
    );
    setEvaluate(true);
  }

  /**
   * Función que evalúa el ingreso de un operador
   */
  function handlerOperator({ target: { innerText } }) {
    if (evaluate) {
      setFormula(currentValue + innerText);
      setCurrentValue(innerText);
      setEvaluate(false);
    } else {
      setCurrentValue(innerText);

      // Si no termina en operador (+,-,*,/)
      if (!endsWithOperator.test(formula)) {
        setPrevValue(formula);
        setFormula(formula + innerText);

        // Si no termina en negativo (--,+-,*-,/-)
      } else if (!endsWithNegativeSign.test(formula)) {
        setFormula(
          // Si termina en negativo (--,+-,*-,/-)
          (endsWithNegativeSign.test(formula + innerText)
            ? formula
            : prevValue) + innerText
        );

        // Si la entrada es diferente a '-'
      } else if (innerText !== '-') {
        setFormula(prevValue + innerText);
      }
    }
  }

  /**
   * Función que limpia los valores
   */
  function handlerInitialize() {
    setFormula('');
    setCurrentValue('0');
    setPrevValue('0');
    setEvaluate(false);
  }

  /**
   * Función para cambiar el estilo de la calculadora
   */
  function changeMode(mode) {
    setMode(mode);
  }

  return (
    <div className={'container ' + mode}>
      <div className='calculator'>
        <ChangeStyle change={changeMode} />
        <div className='screen'>
          <div className='formula'>{formula}</div>
          <div className='output'>{currentValue}</div>
        </div>
        <div className='buttons'>
          {buttons.map((button) => (
            <Button
              key={button.id}
              number={handlerNumber}
              decimal={handlerDecimal}
              equal={handlerEqual}
              operator={handlerOperator}
              initialize={handlerInitialize}
              type={button.type}
              id={button.id}
            >
              {button.value}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
