import React, { useEffect, useRef, useState } from 'react';
import { Brand, Nav, NavItem, NavList, PageSidebar } from '@patternfly/react-core';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';
import { FlyoutMenu } from './FlyoutMenu';
import { NavLink } from 'react-router-dom';
import { FlyoutWizardProvider } from '@app/FlyoutWizard/FlyoutWizardContext';
import { FlyoutList } from '@app/FlyoutList/FlyoutList';
import { FlyoutWizard } from '@app/FlyoutWizard/FlyoutWizard';
import { FlyoutForm } from '@app/FlyoutForm/FlyoutForm';
import { useDropzone } from 'react-dropzone';
import { getId } from '@app/utils/utils';
import { ErrorObject } from '@app/types/ErrorObject';
import { UserFacingFile } from '@app/types/UserFacingFile';

export const SidebarWithFlyout: React.FunctionComponent = () => {
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [visibleFlyout, setVisibleFlyout] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [files, setFiles] = useState<UserFacingFile[]>([]);
  const [error, setError] = useState<ErrorObject>();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const flyoutMenuRef = useRef<HTMLDivElement>(null);

  // example of how you can read a text file
  const readFile = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const { open, getInputProps } = useDropzone({
    onDropAccepted: (files: File[]) => {
      // handle file drop/selection
      setIsLoadingFile(true);
      // any custom validation you may want
      if (files.length > 2) {
        setFiles([]);
        setError({ title: 'Uploaded more than two files', body: 'Upload fewer files' });
        return;
      }
      // this is 200MB in bytes; size is in bytes
      const anyFileTooBig = files.every((file) => file.size > 200000000);
      if (anyFileTooBig) {
        setFiles([]);
        setError({ title: 'Uploaded a file larger than 200MB.', body: 'Try a uploading a smaller file' });
        return;
      }

      const newFiles = files.map((file) => {
        return {
          name: file.name,
          id: getId(),
        };
      });
      setFiles(newFiles);

      // example of how to read file - this is where you'd send it to the server and trigger some sort of loading state
      files.forEach((file) => {
        readFile(file)
          .then((data) => {
            // eslint-disable-next-line no-console
            console.log(data);
            setError(undefined);
            // this is just for demo purposes, to make the loading state really obvious
            setTimeout(() => {
              setIsLoadingFile(false);
            }, 1000);
          })
          .catch((error: DOMException) => {
            setError({ title: 'Failed to read file', body: error.message });
          });
      });
    },
  });

  // Capture sidebar height initially and whenever it changes.
  // We use this to control the flyout height.
  useEffect(() => {
    const updateHeight = () => {
      if (sidebarRef.current) {
        setSidebarHeight(sidebarRef.current.offsetHeight);
      }
    };

    // Set initial height and add event listeners for window resize
    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Adjust flyout height to match the sidebar height when flyout is visible
  useEffect(() => {
    if (visibleFlyout && sidebarRef.current && flyoutMenuRef.current) {
      const sidebarHeight = sidebarRef.current.offsetHeight;
      flyoutMenuRef.current.style.height = `${sidebarHeight}px`;
    }
  }, [visibleFlyout]);

  const toggleFlyout = (e) => {
    if (visibleFlyout === e.target.innerText) {
      setVisibleFlyout(null);
    } else {
      setVisibleFlyout(e.target.innerText);
    }
  };

  /*const FLYOUT_CONTENT = {
    Assistants: {
      title: 'Create your first assistant',
      subtitle: 'Work smarter and faster with tailored assistance',
      primaryButtonText: 'Create assistant',
    },
  };*/

  const renderContent = (visibleFlyout) => {
    if (visibleFlyout === 'Assistants') {
      return (
        <FlyoutWizardProvider>
          <FlyoutWizard
            steps={[
              /*<FlyoutStartScreen
                key="assistant-start"
                title={FLYOUT_CONTENT[visibleFlyout].title}
                subtitle={FLYOUT_CONTENT[visibleFlyout].subtitle}
                primaryButtonText={FLYOUT_CONTENT[visibleFlyout].primaryButtonText}
                header="Assistants"
                hideFlyout={() => setVisibleFlyout(null)}
              />,*/
              <FlyoutList
                key="assistant-list"
                hideFlyout={() => setVisibleFlyout(null)}
                buttonText="New assistant"
                typeWordPlural="assistants"
                title={visibleFlyout}
              />,
              <FlyoutForm key="assistant-form" header="New assistant" hideFlyout={() => setVisibleFlyout(null)} />,
            ]}
          />
        </FlyoutWizardProvider>
      );
    }
    if (visibleFlyout === 'Files') {
      return (
        <FlyoutWizardProvider>
          {/* this is required for upload function open() to work in Safari and Firefox */}
          <input {...getInputProps()} />
          <FlyoutWizard
            steps={[
              <FlyoutList
                key="files-list"
                hideFlyout={() => setVisibleFlyout(null)}
                buttonText="New file"
                typeWordPlural="files"
                title={visibleFlyout}
                onFooterButtonClick={() => {
                  open();
                }}
                error={error}
                isLoading={isLoadingFile}
                onRetry={() => {
                  open();
                }}
              />,
            ]}
          />
        </FlyoutWizardProvider>
      );
    }
    return;
  };

  return (
    <PageSidebar>
      <div id="page-sidebar" ref={sidebarRef} className="pf-c-page__sidebar" style={{ height: '100%' }}>
        <div className="sidebar-masthead">
          <div className="show-light">
            <Brand src={logo} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
          </div>
          <div className="show-dark">
            <Brand src={logoDark} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
          </div>
        </div>

        <Nav id="nav-primary-simple" className="pf-c-nav sidebar-nav" aria-label="Global">
          <NavList>
            <NavItem onClick={() => setVisibleFlyout(null)}>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem
              component="button"
              onClick={toggleFlyout}
              aria-haspopup="dialog"
              aria-expanded={visibleFlyout === 'Assistants'}
            >
              Assistants
            </NavItem>
            <NavItem
              component="button"
              onClick={toggleFlyout}
              aria-haspopup="dialog"
              aria-expanded={visibleFlyout === 'Files'}
            >
              Files
            </NavItem>
          </NavList>
        </Nav>
        {/* Flyout menu */}
        {visibleFlyout && (
          <FlyoutMenu key={visibleFlyout} id={visibleFlyout} height={sidebarHeight}>
            {renderContent(visibleFlyout)}
          </FlyoutMenu>
        )}
      </div>
    </PageSidebar>
  );
};
