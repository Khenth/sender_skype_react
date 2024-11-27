import {
    FilledInputProps,
    InputBaseComponentProps,
    InputProps,
    OutlinedInputProps,
    SxProps,
    TextField,
    TextFieldVariants,
    Theme,
    Tooltip
} from '@mui/material';
import React, { useEffect, useRef, forwardRef } from 'react';

interface CustomTextFieldProps {
    ref?: React.Ref<HTMLInputElement>;
    label?: React.ReactNode;
    required?: boolean;
    fullWidth?: boolean;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    name?: string;
    value?: unknown;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    error?: boolean;
    helperText?: React.ReactNode;
    id?: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    disabled?: boolean;
    sx?: SxProps<Theme>;
    shrink?: boolean;
    variant?: TextFieldVariants;
    inputProps?: InputBaseComponentProps;
    InputProps?: Partial<FilledInputProps> | Partial<InputProps> | Partial<OutlinedInputProps>;
    multiline?: boolean;
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    autoFocus?: boolean;
    autoComplete?: 'off' | 'on';
    tooltip?: string;  // Nueva propiedad para el tooltip
}

const CustomTextField = forwardRef<HTMLInputElement, CustomTextFieldProps>((props, ref) => {
    const {
        id,
        onClick,
        autoFocus,
        onKeyDown,
        onFocus,
        value,
        error,
        helperText,
        onChange,
        fullWidth,
        label,
        name,
        placeholder,
        required,
        type,
        onBlur,
        disabled,
        sx,
        shrink,
        variant,
        inputProps,
        InputProps,
        multiline,
        autoComplete,
        tooltip // Obtener la propiedad tooltip
    } = props;

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const textField = (
        <TextField
            onFocus={onFocus}
            onClick={onClick}
            ref={ref || inputRef}
            variant={variant}
            sx={{ ...sx }}
            id={id}
            inputRef={inputRef}
            InputLabelProps={{ shrink: shrink }}
            fullWidth={fullWidth}
            required={required}
            label={label}
            placeholder={placeholder}
            type={type}
            name={name}
            size="small"
            multiline={multiline}
            InputProps={variant === 'standard' ? {
                disableUnderline: true,
                ...InputProps
            } : { ...InputProps }}
            inputProps={{ ...inputProps }}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            onBlur={onBlur}
            disabled={disabled}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
        />
    );

    // Renderizar con o sin Tooltip basado en la existencia de la propiedad 'tooltip'
    return tooltip ? (
        <Tooltip title={tooltip}>
            {textField}
        </Tooltip>
    ) : (
        textField
    );
});

export { CustomTextField };
