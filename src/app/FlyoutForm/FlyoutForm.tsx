import {
  ActionGroup,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  FileUpload,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import * as React from 'react';

export const FlyoutForm: React.FunctionComponent = () => {
  const [title, setTitle] = React.useState('');
  const [model, setModel] = React.useState('');
  const [instructions, setInstructions] = React.useState('');
  const [icon, setIcon] = React.useState('');
  const [filename, setFilename] = React.useState('');

  const handleFileInputChange = (_, file: File) => {
    setFilename(file.name);
  };

  const handleClear = () => {
    setFilename('');
    setIcon('');
  };
  const [isOpen, setIsOpen] = React.useState(false);

  const handleTitleChange = (_event, title: string) => {
    setTitle(title);
  };

  const handleModelChange = (_event, value: string | number | undefined) => {
    if (value && typeof value === 'string') {
      setModel(value);
      return;
    }
    setModel('');
  };

  const handleInstructionsChange = (_event, instructions: string) => {
    setInstructions(instructions);
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Form className="flyout-form">
      <FormGroup label="Title" isRequired fieldId="flyout-form-title">
        <TextInput
          type="text"
          id="flyout-form-title"
          name="flyout-form-title"
          value={title}
          onChange={handleTitleChange}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Describe what a user can do with your assistant</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
      <FormGroup label="Model" fieldId="flyout-form-model">
        <Dropdown
          id="flyout-form-model"
          className="assistant-selector-menu"
          isOpen={isOpen}
          onSelect={handleModelChange}
          onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
          ouiaId="BasicDropdown"
          shouldFocusToggleOnSelect
          onOpenChangeKeys={['Escape']}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
              Choose a model
            </MenuToggle>
          )}
          popperProps={{ appendTo: 'inline' }}
        >
          <DropdownList>
            <DropdownItem key="one" value="one" isSelected={model === 'one'}>
              one
            </DropdownItem>
            <DropdownItem key="two" value="two" isSelected={model === 'two'}>
              two
            </DropdownItem>
          </DropdownList>
        </Dropdown>
      </FormGroup>
      <FormGroup label="Icon" fieldId="flyout-form-icon">
        <FileUpload
          className="flyout-form-fileupload"
          id="flyout-form-icon"
          value={icon}
          filename={filename}
          filenamePlaceholder="Drag and drop a file or upload one"
          onFileInputChange={handleFileInputChange}
          onClearClick={handleClear}
          browseButtonText="Upload"
        />
      </FormGroup>
      <FormGroup fieldId="flyout-form-instructions" label="Custom instructions">
        <TextArea
          id="flyout-form-instructions"
          value={instructions}
          onChange={handleInstructionsChange}
          aria-label="Text area for custom instructions"
          resizeOrientation="vertical"
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem>Describe what a user can do with your assistant</HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
      <ActionGroup className="flyout-form-footer">
        <Button variant="link">Cancel</Button>
        <Button variant="primary">Create assistant</Button>
      </ActionGroup>
    </Form>
  );
};
