import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { useFlyoutWizard } from '@app/FlyoutWizard/FlyoutWizardContext';
import { Button } from '@patternfly/react-core';
import * as React from 'react';

interface FlyoutStartScreenProps {
  image?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  header: React.ReactNode;
  hideFlyout: () => void;
}
export const FlyoutStartScreen: React.FunctionComponent<FlyoutStartScreenProps> = ({
  image,
  imageAlt,
  subtitle,
  title,
  primaryButtonText,
  secondaryButtonText,
  header,
  hideFlyout,
}: FlyoutStartScreenProps) => {
  const { nextStep } = useFlyoutWizard();
  return (
    <>
      <FlyoutHeader title={header} hideFlyout={hideFlyout} />
      <div className="start-screen">
        {image && <img src={image} alt={imageAlt} />}
        <div className="start-screen-text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="start-screen-actions">
          {primaryButtonText && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                nextStep();
              }}
            >
              {primaryButtonText}
            </Button>
          )}
          {secondaryButtonText && (
            <>
              <p>or</p>
              <Button variant="secondary">{secondaryButtonText}</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
