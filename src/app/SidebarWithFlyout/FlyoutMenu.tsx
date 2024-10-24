import { FocusTrap } from '@patternfly/react-core';
import React from 'react';

interface FlyoutMenuProps {
  id: string;
  height: number;
  children: React.ReactNode;
  hideFlyout: () => void;
}
export const FlyoutMenu: React.FunctionComponent<FlyoutMenuProps> = ({
  id,
  height,
  children,
  hideFlyout,
}: FlyoutMenuProps) => {
  const previouslyFocusedElement = React.useRef<HTMLElement>(null);

  const handleFlyout = (event) => {
    const key = event.key;
    if (key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      hideFlyout();
    }
  };

  const focusTrapProps = {
    tabIndex: -1,
    'aria-modal': true,
    role: 'dialog',
    active: true,
    'aria-labelledby': id,
    focusTrapOptions: {
      //fallbackFocus: () => panel.current,
      onActivate: () => {
        if (previouslyFocusedElement.current !== document.activeElement) {
          //@ts-expect-error can't assign to current
          previouslyFocusedElement.current = document.activeElement;
        }
      },
      onDeactivate: () => {
        previouslyFocusedElement.current &&
          previouslyFocusedElement.current.focus &&
          previouslyFocusedElement.current.focus();
      },
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: false,
      // FocusTrap's initialFocus can accept false as a value to prevent initial focus.
      // We want to prevent this in case false is ever passed in.
      initialFocus: undefined,
      escapeDeactivates: false,
    },
  };

  return (
    <FocusTrap
      id={id}
      className="flyout-menu"
      style={{
        height: `${height}px`,
      }}
      onKeyDown={handleFlyout}
      {...focusTrapProps}
    >
      {children}
    </FocusTrap>
  );
};
