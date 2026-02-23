import * as React from 'react';
import { Input } from '@/components/ui/input';
import { AppButton } from '@/components/ui/app-button';
import { cn } from '@/lib/utils';

export interface InputWithIconProps extends React.ComponentProps<typeof Input> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, leftIcon, rightIcon, onRightIconClick, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            leftIcon && 'pl-10',
            rightIcon ? 'pr-10' : '',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {onRightIconClick ? (
              <AppButton
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={onRightIconClick}
                aria-label="Alternar visibilidade da senha"
              >
                {rightIcon}
              </AppButton>
            ) : (
              <span className="flex h-7 w-7 items-center justify-center text-muted-foreground">
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
InputWithIcon.displayName = 'InputWithIcon';

export { InputWithIcon };
