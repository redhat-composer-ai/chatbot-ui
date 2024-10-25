import { ActionGroup, Button, Menu, MenuContent, MenuItem, MenuList, SearchInput } from '@patternfly/react-core';
import React from 'react';

export const FlyoutList: React.FunctionComponent = () => {
  const EXAMPLES = ['Option 1', 'Option 2'];
  const [items, setItems] = React.useState(EXAMPLES);

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
    // this is where you would perform search on the items in the drawer
    // and update the state
    const newItems = findMatchingItems(value);
    setItems(newItems);
  };

  return (
    <div className="flyout-list">
      <SearchInput
        aria-label="Search assistants"
        onChange={(_event, value) => handleTextInputChange(value)}
        placeholder="Search assistants..."
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
      <ActionGroup className="flyout-list-footer">
        <Button variant="primary">New assistant</Button>
      </ActionGroup>
    </div>
  );
};
