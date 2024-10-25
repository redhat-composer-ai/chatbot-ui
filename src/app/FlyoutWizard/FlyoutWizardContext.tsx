import * as React from 'react';

interface FlyoutWizardContextType {
  currentStep: number;
  data: any;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateData: (newData: any) => void;
}

const FlyoutWizardContext = React.createContext<FlyoutWizardContextType | undefined>(undefined);

export const FlyoutWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [data, setData] = React.useState({});

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const goToStep = (step: number) => setCurrentStep(step);
  const updateData = (newData: any) => setData((prev) => ({ ...prev, ...newData }));

  return (
    <FlyoutWizardContext.Provider value={{ currentStep, data, nextStep, prevStep, goToStep, updateData }}>
      {children}
    </FlyoutWizardContext.Provider>
  );
};

export const useFlyoutWizard = () => {
  const context = React.useContext(FlyoutWizardContext);
  if (!context) {
    throw new Error('useFlyoutWizard must be used within a FlyoutWizardProvider');
  }
  return context;
};
