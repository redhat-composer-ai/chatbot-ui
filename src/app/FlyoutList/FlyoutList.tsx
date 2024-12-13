import { useAppData } from '@app/AppData/AppDataContext';
import { FlyoutError } from '@app/FlyoutError/FlyoutError';
import { FlyoutFooter } from '@app/FlyoutFooter/FlyoutFooter';
import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { FlyoutLoading } from '@app/FlyoutLoading/FlyoutLoading';
import { useFlyoutWizard } from '@app/FlyoutWizard/FlyoutWizardContext';
import { CannedChatbot } from '@app/types/CannedChatbot';
import { ErrorObject } from '@app/types/ErrorObject';
import { ERROR_TITLE } from '@app/utils/utils';
import { Label, Menu, MenuContent, MenuItem, MenuList, SearchInput } from '@patternfly/react-core';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface FlyoutListProps {
  typeWordPlural: string;
  buttonText: string;
  hideFlyout: () => void;
  onFooterButtonClick?: () => void;
  title: string;
  error?: ErrorObject;
  isLoading?: boolean;
  onRetry?: () => void;
}
export const FlyoutList: React.FunctionComponent<FlyoutListProps> = ({
  typeWordPlural,
  buttonText,
  hideFlyout,
  onFooterButtonClick,
  title,
  error: errorProp,
  isLoading: isLoadingProp = true,
  onRetry,
}: FlyoutListProps) => {
  const [error, setError] = React.useState<ErrorObject | undefined>(errorProp);
  const [originalChatbots, setOriginalChatbots] = React.useState<CannedChatbot[]>([]);
  const [filteredChatbots, setFilteredChatbots] = React.useState<CannedChatbot[]>([]);
  // you'll need states for files and filtered files
  const [isLoading, setIsLoading] = React.useState(isLoadingProp);
  const { nextStep, reloadList, setReloadList } = useFlyoutWizard();
  const location = useLocation();
  const navigate = useNavigate();
  const { flyoutMenuSelectedChatbot, updateFlyoutMenuSelectedChatbot, chatbots, setChatbots } = useAppData();

  // used for file case only
  React.useEffect(() => {
    setIsLoading(isLoadingProp);
  }, [isLoadingProp]);

  // used for file case only
  React.useEffect(() => {
    setError(errorProp);
  }, [errorProp]);

  const header = (
    <div className="title-with-label">
      {title} <Label variant="outline">{originalChatbots.length}</Label>
    </div>
  );

  const ERROR_BODY = {
    'Error: 404': `Service is currently unavailable. Click retry or try again later.`,
    'Error: 500': `Service has encountered an error. Click retry or try again later.`,
    'Error: Other': `Service has encountered an error. Click retry or try again later.`,
  };

  const handleError = (e) => {
    console.error(e);
    const title = ERROR_TITLE[e];
    const body = ERROR_BODY[e];
    let newError;
    if (title && body) {
      newError = { title: ERROR_TITLE[e], body: ERROR_BODY[e] };
    } else {
      if ('message' in e) {
        newError = { title: 'Error', body: e.message };
      } else {
        newError = { title: 'Error', body: e };
      }
    }
    setError(newError);
  };

  const getAssistants = async () => {
    const url = process.env.REACT_APP_INFO_URL ?? '';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const data = await response.json();
      setOriginalChatbots(data);
      setFilteredChatbots(data);
      setIsLoading(false);
      setReloadList(false);
      setChatbots(data);
    } catch (error) {
      console.error('Error loading assistants', error);
      handleError(error);
      setIsLoading(false);
    }
  };

  const loadAssistants = async () => {
    if (reloadList) {
      await getAssistants();
      return;
    }
    if (chatbots.length > 0) {
      setOriginalChatbots(chatbots);
      setFilteredChatbots(chatbots);
      setIsLoading(false);
      return;
    }
    await getAssistants();
  };

  React.useEffect(() => {
    if (typeWordPlural === 'assistants') {
      loadAssistants();
    }
    if (typeWordPlural === 'files') {
      // this is where you'd put your API call for files
    }
  }, []);

  const buildMenu = () => {
    return (
      <MenuList>
        {filteredChatbots.map((item) => (
          <MenuItem
            className="pf-chatbot__menu-item"
            itemId={item.name}
            key={item.name}
            isSelected={item.name === flyoutMenuSelectedChatbot?.name}
            description={item.description}
          >
            {item.displayName ?? item.name}
          </MenuItem>
        ))}
      </MenuList>
    );
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value) => {
    if (filteredChatbots.length > 0) {
      const newChatbot = originalChatbots.filter((item) => item.name === value)[0];
      updateFlyoutMenuSelectedChatbot(newChatbot);
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const findMatchingItems = (targetValue: string, originalItems) => {
    const matchingElements = originalItems.filter((item) => {
      const name = item.displayName ?? item.name;
      return name.toLowerCase().includes(targetValue.toLowerCase());
    });
    return matchingElements;
  };

  const handleTextInputChange = (value: string) => {
    if (typeWordPlural === 'assistants') {
      if (value === '') {
        setFilteredChatbots(originalChatbots);
        return;
      }
      const newItems = findMatchingItems(value, originalChatbots);
      setFilteredChatbots(newItems);
    }
    if (typeWordPlural === 'files') {
      // you'll need to add a matcher here based on state
    }
  };

  const onAssistantClick = () => {
    setError(undefined);
    loadAssistants();
  };

  return error ? (
    <FlyoutError
      title={error.title}
      subtitle={error.body}
      onClick={typeWordPlural === 'assistants' ? onAssistantClick : onRetry}
    />
  ) : (
    <>
      <FlyoutHeader title={header} hideFlyout={hideFlyout} />
      {isLoading ? (
        <FlyoutLoading />
      ) : (
        <section className="flyout-list" aria-label={title} tabIndex={-1}>
          <SearchInput
            onChange={(_event, value) => handleTextInputChange(value)}
            placeholder={`Search ${typeWordPlural}...`}
          />
          <Menu className="flyout-list-menu" isPlain onSelect={onSelect}>
            <MenuContent>
              {filteredChatbots.length > 0 ? (
                buildMenu()
              ) : (
                <MenuList>
                  <MenuItem key="no-items">No results found</MenuItem>
                </MenuList>
              )}
            </MenuContent>
          </Menu>
        </section>
      )}
      <FlyoutFooter primaryButton={buttonText} onPrimaryButtonClick={onFooterButtonClick ?? nextStep} />
    </>
  );
};
