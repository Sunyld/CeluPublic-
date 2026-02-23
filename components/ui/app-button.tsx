import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * App-level button wrapper. Uses shadcn Button internally.
 * Standardizes primary/secondary styles across the app.
 */
const variantMap = {
  primary: 'default',
  default: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  destructive: 'destructive',
  link: 'link',
} as const;

export type AppButtonVariant = keyof typeof variantMap;

export interface AppButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: AppButtonVariant;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => (
    <Button
      ref={ref}
      variant={variantMap[variant] as ButtonProps['variant']}
      className={cn(className)}
      {...props}
    />
  )
);
AppButton.displayName = 'AppButton';

export { AppButton };
