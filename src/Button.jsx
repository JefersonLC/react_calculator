import PropTypes from 'prop-types';

export default function Button({
  children,
  number,
  decimal,
  equal,
  operator,
  initialize,
  type,
  id,
}) {
  const operation = Object.freeze({
    number,
    decimal,
    equal,
    operator,
    initialize,
  });

  const style = Object.freeze({
    number: 'number',
    decimal: 'decimal',
    equal: 'equal',
    operator: 'operator',
    initialize: 'initialize',
  });

  return (
    <button
      className={'button ' + style[type]}
      id={id}
      onClick={operation[type]}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.string,
  number: PropTypes.func,
  decimal: PropTypes.func,
  equal: PropTypes.func,
  delete: PropTypes.func,
  operator: PropTypes.func,
  initialize: PropTypes.func,
  type: PropTypes.string,
  id: PropTypes.string,
};
