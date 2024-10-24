import { Button } from '@patternfly/react-core';
import * as React from 'react';

interface FlyoutStartScreenProps {
  image?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}
const FlyoutStartScreen: React.FunctionComponent<FlyoutStartScreenProps> = ({
  image,
  imageAlt,
  subtitle,
  title,
  primaryButtonText,
  secondaryButtonText,
}: FlyoutStartScreenProps) => {
  return (
    <div className="start-screen">
      {image && <img src={image} alt={imageAlt} />}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {primaryButtonText && <Button>{primaryButtonText}</Button>}
      {secondaryButtonText && (
        <>
          <p>or</p>
          <Button>{secondaryButtonText}</Button>
        </>
      )}
    </div>
  );
};

export default FlyoutStartScreen;
