// Formik turned the text of a number input into a number ('' stays '' when it is cleared);
// pass this to react-hook-form's `register(name, { setValueAs })` to keep sending numbers.
export const numberOrEmpty = (value) => (value === '' ? '' : Number(value));
