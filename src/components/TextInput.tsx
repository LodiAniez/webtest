import { ArgFunction, } from '@/types';
import React, { ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from "./TextInput.module.css"
import useDebounce from '@/hooks/useDebounce';
import { CurrencyNoDeci, getFormattedPhoneNum, isFloat, isNumber, } from '@/utils/functions';
import useKeyListener from '@/hooks/useKeyListener';
import Images from '@/common/images';
type Props = {
    type?: React.HTMLInputTypeAttribute;
    label?: string | ReactNode;
    labelStyle?: React.CSSProperties
    labelClassName?: string;
    bottomLabel?: string | ReactNode;
    disabled?: boolean;
    placeholder?: string;
    value?: string | number | null;
    inputRef?: React.MutableRefObject<HTMLInputElement | null>
    containerStyle?: React.CSSProperties
    containerClassName?: string;
    inputStyle?: React.CSSProperties
    inputClassName?: string;
    autofocus?: boolean;
    dataContent?: string
    required?: boolean
    setValue?: (event: React.ChangeEvent<HTMLInputElement>, isEnterPressed?: boolean) => void;
    onClick?: ArgFunction<React.MouseEvent<HTMLInputElement, MouseEvent>>;
    onFocus?: ArgFunction<any>
    onBlur?: ArgFunction<any>;
    name?: string;
    error?: boolean;
    maxLength?: number;
    debounce?: boolean;
    prefix?: string
    sufix?: string
    isNumber?: boolean
    autoComplete?: "off"
    delay?: number
    isCurrency?: boolean
    maxValue?: number
    minValue?: number
    readonly?: boolean
    greaterThanZero?: boolean
    noNegative?: boolean
    noDecimal?: boolean
    id?: string
}
const TextInput = (props: Props) => {
    const {
        isCurrency,
        type: inputType = "text",
        label,
        labelClassName,
        labelStyle,
        bottomLabel,
        disabled = false,
        placeholder,
        value,
        setValue,
        containerStyle,
        containerClassName,
        inputClassName,
        autofocus,
        inputStyle,
        onClick,
        dataContent,
        required,
        onFocus,
        onBlur,
        name,
        error = false,
        maxLength,
        debounce = true,
        prefix = "",
        sufix = "",
        isNumber: IsNumber,
        autoComplete,
        delay = 500,
        maxValue,
        minValue,
        inputRef,
        readonly,
        noDecimal,
        noNegative,
        greaterThanZero,
        id = String(name ?? label),

    } = props;

    const eventRef = useRef<React.ChangeEvent<HTMLInputElement>>()
    const [isEnterPressed, setIsEnterPressed] = useState(false);
    const [type, setType] = useState<React.HTMLInputTypeAttribute>(inputType)
    const [text, setText] = useState((value ?? ""))
    const debouncedText = useDebounce(text, delay)
    const isInputTypeNumber = useMemo(() => isCurrency || IsNumber || inputType === "number", [isCurrency, IsNumber, inputType]);
    const isDebounced = useMemo(() => isCurrency || debounce, [isCurrency, debounce]);
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        // Check if the pressed key is 'Enter' (keyCode 13)
        if (event.key === 'Enter') {
            setIsEnterPressed(true);
        }
    }, [setIsEnterPressed]);


    const textInputContent = useCallback(() => {
        const kwaw = isDebounced ? text : (value ?? "")
        if (isCurrency) return value !== undefined || value !== null ? CurrencyNoDeci.format(isNumber(kwaw) ? Number(kwaw) : 0) : undefined
        if ((isInputTypeNumber) && (!isNumber(Number(eventRef.current ? eventRef.current.target.value : value)) || (noDecimal && isFloat(Number(eventRef.current ? eventRef.current.target.value : value))) || (noNegative && (Number(eventRef.current ? eventRef.current.target.value : value) < 0)) || (greaterThanZero && (Number(eventRef.current ? eventRef.current.target.value : value) <= 0)))) return 0
        else return (kwaw)
    }, [value, isCurrency, prefix, isDebounced, text, sufix, isInputTypeNumber, eventRef.current, noDecimal, noNegative, greaterThanZero,])

    useEffect(() => {
        if (disabled) return;
        if (eventRef.current === undefined) return;
        if (greaterThanZero && (Number(eventRef.current.target.value) <= 0)) return;
        if ((isInputTypeNumber) && (!isNumber(Number(eventRef.current.target.value)) || (noDecimal && String(eventRef.current.target.value).includes(".")) || (noNegative && (Number(eventRef.current.target.value) < 0)))) return
        if (debouncedText !== value) {
            const value = (eventRef.current?.target?.value)
            const eventValue = isInputTypeNumber ? String(value).includes(".") ? Number(value) : Number(value) : value;
            const event = {
                ...eventRef.current,
                target: {
                    ...eventRef.current.target,
                    name: (name ?? ""),
                    value: eventValue
                }
            } as React.ChangeEvent<HTMLInputElement>;
            if (isInputTypeNumber && (Number(eventValue) > 99999999 || (maxValue && Number(eventValue) > maxValue))) return;
            if (setValue) setValue(event, isEnterPressed);
        }
    }, [debouncedText])
    useEffect(() => {
        if ((isInputTypeNumber) && !isNumber(Number(value))) return
        if (value !== text && isDebounced && !disabled) setText((value ?? ""))
    }, [value])

    if (type === "tel") return <TelTextInput
        type={type}
        label={label}
        bottomLabel={bottomLabel}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        containerStyle={containerStyle}
        containerClassName={containerClassName}
        inputClassName={inputClassName}
        labelClassName={labelClassName}
        autofocus={autofocus}
        labelStyle={labelStyle}
        inputStyle={inputStyle}
        onClick={onClick}
        dataContent={dataContent}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
        error={error}
        maxLength={maxLength}
        debounce={debounce}
        inputRef={inputRef}
        id={id}
        readonly={readonly}
    />

    return (
        <div style={containerStyle} className={[styles.container, containerClassName].join(" ")} data-content={dataContent}>
            {label ? <label htmlFor={id} style={labelStyle} className={["SemiBold ", styles.topLabel, error && styles.errorLabel, labelClassName].join(" ")}>{label}
            </label> : null}
            <input
                autoCorrect={autoComplete}
                readOnly={readonly}
                max={maxValue}
                min={minValue}
                autoComplete={autoComplete}
                ref={inputRef}
                minLength={type === "password" ? 12 : undefined}
                maxLength={maxLength}
                onBlur={onBlur}
                onFocus={onFocus}
                required={required}
                style={inputStyle}
                onClick={(e) => onClick ? onClick(e) : e.stopPropagation()}
                type={(isCurrency ? "text" : type)}
                name={name}
                id={id}
                autoFocus={autofocus}
                disabled={disabled}
                className={[disabled ? styles.disabledInput : styles.input, error && styles.errorInput, (inputType === "number" || isCurrency) && "text-center", inputClassName].join(" ")}
                placeholder={placeholder}
                value={isInputTypeNumber && typeof value === "undefined" ? undefined : textInputContent()}
                onChange={(e) => {
                    const value = e.target.value.replaceAll(",", "").replaceAll("$", "")
                    if (disabled) return;
                    if (isCurrency && (!isNumber(Number(value)) || Number(value) < 0)) return;
                    if ((isCurrency || inputType === "number") && ((maxValue && maxValue < Number(value.replace(/^0+(?=[1-9])/, '').replace(/(\.\d{2}).*$/, '$1'))) || (minValue && minValue > Number(value.replace(/^0+(?=[1-9])/, '').replace(/(\.\d{2}).*$/, '$1'))))) return;
                    if ((isInputTypeNumber) && (!isNumber(Number(value)) || (noDecimal && isFloat(Number(value))) || (noNegative && (Number(value) < 0)))) return
                    if (maxLength && value.length > maxLength) return;
                    const event: React.ChangeEvent<HTMLInputElement> = {
                        ...e,
                        target: {
                            ...e.target,
                            name: (name ?? ""),
                            value: (isInputTypeNumber ?
                                String(value).includes(".") ? value : Number(value) :
                                isCurrency ? value.replace(/^0+(?=[1-9])/, '').replace(/(\.\d{2}).*$/, '$1') :
                                    value) as string
                        }
                    }
                    if (isDebounced) {
                        eventRef.current = event
                        setText(String(event.target.value))
                    } else {
                        if ((greaterThanZero && (Number(event.target.value) <= 0))) return;
                        if ((isInputTypeNumber) && !isNumber(Number(event.target.value))) return
                        if (isInputTypeNumber && (Number(event.target.value) > 99999999 || (maxValue && Number(event.target.value) > maxValue))) return;
                        if (setValue) setValue(event, isEnterPressed)
                    }
                }}
                onKeyDown={handleKeyDown}
            />
            {
                inputType === "password" ?
                    <button

                        id={`btn_toggle_password`}
                        className='absolute'
                        style={{
                            right: "2px",
                            bottom: type === "password" ? "1px" : "0.5px"
                        }}
                        onClick={() => {
                            setType(prev => prev === "password" ? "text" : "password")
                        }}
                        type="button">
                        <img
                            height={type === "password" ? 17 : 20}
                            src={Images[type === "password" ? "ic_eye_show" : "ic_eye_hidden"]}
                        />
                    </button>
                    : null
            }
            {bottomLabel ? <><br /><label htmlFor={id} style={labelStyle} className={[styles.bottomLabel, labelClassName].join(" ")}>{bottomLabel}</label></> : null}

        </div >
    )
}

const TelTextInput = (props: Props) => {
    const {
        type = "text",
        label,
        bottomLabel,
        disabled = false,
        placeholder,
        value,
        setValue,
        containerStyle,
        containerClassName,
        inputClassName,
        labelClassName,
        autofocus,
        labelStyle,
        inputStyle,
        onClick,
        dataContent,
        required,
        onFocus,
        onBlur,
        name,
        error = false,
        maxLength,
        debounce,
        prefix = "",
        sufix = "",
        inputRef,
        readonly,
        isCurrency,
        isNumber: IsNumber,
        id = String(label)
    } = props


    const isInputTypeNumber = isCurrency || IsNumber || type === "number";
    const eventRef = useRef<React.ChangeEvent<HTMLInputElement>>()
    const [text, setText] = useState(value)
    const [usaFormattedPhoneNumber, setUsaFormattedPhoneNumber] = React.useState(
        String(value).includes("+1") ?
            getFormattedPhoneNum(String(value).slice(2)) :
            getFormattedPhoneNum(String(value)));

    const debouncedText = useDebounce(text, 500)


    useEffect(() => {
        if (disabled) return
        if (eventRef.current?.target?.value === undefined) return;
        if (debouncedText !== value) {
            const newEvent = {
                ...eventRef.current,
                target: {
                    ...eventRef.current?.target,
                    value: String(text),
                    name: (name ?? ""),
                }
            } as React.ChangeEvent<HTMLInputElement>
            if (isInputTypeNumber && (!isNumber(Number(newEvent.target.value)) || Number(newEvent.target.value) > 99999999)) return;
            if (setValue) setValue(newEvent)
        }
    }, [debouncedText])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        eventRef.current = {
            ...event,
            target: {
                ...event.target,
                value: event.currentTarget.value,
            }
        }
        const inputValue = event.currentTarget.value;
        if (inputValue.length === 17) return;
        const formattedNumber = getFormattedPhoneNum(inputValue);
        setUsaFormattedPhoneNumber(formattedNumber);
        if (debounce) {
            setText("+1" + inputValue.replace(/\D/g, ''))
        } else {
            const newEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: String("+1" + inputValue.replace(/\D/g, '')),
                    name: (name ?? ""),
                }
            }
            if (isInputTypeNumber && Number(newEvent.target.value) > 99999999) return;
            if (setValue) setValue(newEvent,)
        }
    }
    useKeyListener({
        key: "Backspace",
        callback: () => {
            if (usaFormattedPhoneNumber.at(-1) === "-") setUsaFormattedPhoneNumber(usaFormattedPhoneNumber.slice(0, -1))
        },
        dependencies: [text, usaFormattedPhoneNumber]
    })
    return (
        <div style={containerStyle} className={[styles.container, containerClassName].join(" ")} data-content={dataContent}>
            {label ? <label htmlFor={id} style={labelStyle} className={["SemiBold ", styles.topLabel, error && styles.errorLabel, labelClassName].join(" ")}>{label}
            </label> : null}  <input
                autoComplete='off'
                autoCorrect='off'
                readOnly={readonly}
                ref={inputRef}
                maxLength={maxLength}
                onBlur={onBlur}
                onFocus={onFocus}
                required={required}
                style={inputStyle}
                onClick={(e) => onClick ? onClick(e) : e.stopPropagation()}
                type={"tel"}
                name={name}
                id={id}
                autoFocus={autofocus}
                disabled={disabled}
                className={[disabled ? styles.disabledInput : styles.input, error && styles.errorInput, inputClassName].join(" ")}
                placeholder={placeholder}
                value={usaFormattedPhoneNumber}
                onChange={handleInputChange}
            />
            {bottomLabel ? <><br /><label htmlFor={id} style={labelStyle} className={[styles.bottomLabel, labelClassName].join(" ")}>{bottomLabel}</label></> : null}

        </div >
    )
}

export default memo(TextInput)