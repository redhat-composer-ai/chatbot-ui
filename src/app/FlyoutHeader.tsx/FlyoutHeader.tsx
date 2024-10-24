import { Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import * as React from 'react';

interface FlyoutHeaderProps {
  title: string;
  hideFlyout: () => void;
}
export const FlyoutHeader: React.FunctionComponent<FlyoutHeaderProps> = ({ title, hideFlyout }: FlyoutHeaderProps) => {
  return (
    <div className="flyout-header">
      {title}
      <Button onClick={hideFlyout} variant="plain" icon={<TimesIcon />} />
    </div>
  );
};
