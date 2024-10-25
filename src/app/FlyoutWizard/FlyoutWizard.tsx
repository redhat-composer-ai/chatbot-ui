import { useFlyoutWizard } from './FlyoutWizardContext';
import * as React from 'react';

export const FlyoutWizard: React.FC<{ steps: React.ReactNode[] }> = ({ steps }) => {
  const { currentStep } = useFlyoutWizard();

  return <>{steps[currentStep]}</>;
};
