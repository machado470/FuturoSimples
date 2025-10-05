import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Button(props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <button {...props} style={{padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc'}}/>;
}
