import React from 'react';

// An <input> that reports changes after the user pauses typing. It keeps the text locally so
// typing stays responsive, and only takes the `value` prop back while no change is pending.
function DebouncedInput({ value, defaultValue, onChange, debounceTimeout = 100, ...rest }) {
    const [text, setText] = React.useState(value ?? defaultValue ?? '');
    const timer = React.useRef(null);
    const latestOnChange = React.useRef(onChange);

    React.useEffect(() => {
        latestOnChange.current = onChange;
    });

    React.useEffect(() => {
        // Without a `value` prop the input is not controlled from outside, so keep what was typed.
        if (value !== undefined && timer.current === null) {
            setText(value);
        }
    }, [value]);

    React.useEffect(() => () => clearTimeout(timer.current), []);

    const handleChange = (event) => {
        setText(event.target.value);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            timer.current = null;
            latestOnChange.current?.(event);
        }, debounceTimeout);
    };

    return <input {...rest} value={text} onChange={handleChange} />;
}

export default DebouncedInput;
