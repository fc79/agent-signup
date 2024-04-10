import React, { useMemo } from 'react';
import { RE_DIGIT } from '../../core/constants';

export type Props = {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
  onKeyDown?:any;
};
export default function OtpInput({ value, valueLength, onKeyDown, onChange }: Props) {
  const valueItems = useMemo(() => {
    const valueArray = value.split('');
    const items: Array<string> = [];
    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];
      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push('');
      }
    }
    return items;
  }, [value, valueLength]);
  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;
    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };
  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling = target.previousElementSibling as HTMLInputElement | null;
    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };
  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== '') {
      return;
    }
    const nextInputEl = target.nextElementSibling as HTMLInputElement | null;
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== '') {
      return;
    }
    targetValue = isTargetValueDigit ? targetValue : ' ';
    const targetValueLength = targetValue.length;
    if (targetValueLength === 1) {
      const newValue = value.substring(0, idx) + targetValue + value.substring(idx + 1);
      onChange(newValue);
      if (!isTargetValueDigit) {
        return;
      }
      focusToNextInput(target);
    } else if (targetValueLength === valueLength) {
      onChange(targetValue);
      target.blur();
    }
  };
  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault();
      return focusToNextInput(target);
    }
    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault();
      return focusToPrevInput(target);
    }
    const targetValue = target.value;
    target.setSelectionRange(0, targetValue.length);
    if (e.key !== 'Backspace' || targetValue !== '') {
      return;
    }
    focusToPrevInput(target);
  };
  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;
    const prevInputEl = target.previousElementSibling as HTMLInputElement | null;
    if (prevInputEl && prevInputEl.value === '') {
      return prevInputEl.focus();
    }
    target.setSelectionRange(0, target.value.length);
  };
  return (
    <div className="otp-group" onKeyDown={onKeyDown}>
      {valueItems.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={valueLength}
          className={`otp-input ${digit ? "border-green" : "border-yellow"}`}
          value={digit}
          onChange={(e) => inputOnChange(e, idx)}
          onKeyDown={inputOnKeyDown}
          onFocus={inputOnFocus}
        />
      ))}
    </div>
  );
}