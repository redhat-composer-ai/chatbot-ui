import { FlyoutFooter } from '@app/FlyoutFooter/FlyoutFooter';
import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { useFlyoutWizard } from '@app/FlyoutWizard/FlyoutWizardContext';
import { Menu, MenuContent, MenuItem, MenuList, SearchInput } from '@patternfly/react-core';
import * as React from 'react';

interface FlyoutListProps {
  typeWordPlural: string;
  buttonText: string;
  header: React.ReactNode;
  hideFlyout: () => void;
  onFooterButtonClick?: () => void;
}
export const FlyoutList: React.FunctionComponent<FlyoutListProps> = ({
  typeWordPlural,
  buttonText,
  header,
  hideFlyout,
  onFooterButtonClick,
}: FlyoutListProps) => {
  const EXAMPLES = ['Option 1', 'Option 2'];
  const [items, setItems] = React.useState(EXAMPLES);
  const { prevStep } = useFlyoutWizard();

  const buildMenu = (items) => {
    return (
      <MenuList>
        {items.map((item) => (
          <MenuItem className="pf-chatbot__menu-item" itemId={item} key={item}>
            {item}
          </MenuItem>
        ))}
      </MenuList>
    );
  };

  const onSelectActiveItem = () => {};
  const activeItemId = '1';

  const findMatchingItems = (targetValue: string) => {
    const matchingElements = EXAMPLES.filter((element) => element.toLowerCase().includes(targetValue.toLowerCase()));
    return matchingElements;
  };

  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setItems(EXAMPLES);
      return;
    }
    const newItems = findMatchingItems(value);
    setItems(newItems);
  };

  return (
    <>
      <FlyoutHeader title={header} hideFlyout={hideFlyout} />
      <div className="flyout-list">
        <SearchInput
          aria-label={`Search ${typeWordPlural}`}
          onChange={(_event, value) => handleTextInputChange(value)}
          placeholder={`Search ${typeWordPlural}...`}
        />
        <Menu className="flyout-list-menu" isPlain onSelect={onSelectActiveItem} activeItemId={activeItemId}>
          <MenuContent>
            {items.length > 0 ? (
              buildMenu(items)
            ) : (
              <MenuList>
                <MenuItem key="no-items">No results found</MenuItem>
              </MenuList>
            )}
          </MenuContent>{' '}
        </Menu>
      </div>
      <FlyoutFooter primaryButton={buttonText} onPrimaryButtonClick={onFooterButtonClick ?? prevStep} />
    </>
  );
};
