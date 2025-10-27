const Input = ({ name, value, onChange, ...rest }) => {
  return (
    <input
      {...rest}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Input;
