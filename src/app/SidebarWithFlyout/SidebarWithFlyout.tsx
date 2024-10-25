import * as React from 'react';
import { Brand, Label, Nav, NavItem, NavList, PageSidebar } from '@patternfly/react-core';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';
import { FlyoutStartScreen } from '@app/FlyoutStartScreen.tsx/FlyoutStartScreen';
import { FlyoutMenu } from './FlyoutMenu';
import { FlyoutForm } from '@app/FlyoutForm/FlyoutForm';
import { FlyoutLoading } from '@app/FlyoutLoading/FlyoutLoading';
import { FlyoutList } from '@app/FlyoutList/FlyoutList';
import { FlyoutWizardProvider } from '@app/FlyoutWizard/FlyoutWizardContext';
import { FlyoutWizard } from '@app/FlyoutWizard/FlyoutWizard';

export const SidebarWithFlyout: React.FunctionComponent = () => {
  const [sidebarHeight, setSidebarHeight] = React.useState(0);
  const [visibleFlyout, setVisibleFlyout] = React.useState<string | undefined>(undefined);
  const [isLoading] = React.useState(false);
  const flyoutMenuRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const FLYOUT_CONTENT = {
    Assistants: {
      title: 'Create your first assistant',
      subtitle: 'Work smarter and faster with tailored assistance',
      primaryButtonText: 'Create assistant',
    },
    Files: {
      title: 'Upload your first file',
      subtitle: 'Analyze information and streamline workflows',
      primaryButtonText: 'Upload files',
    },
  };

  React.useEffect(() => {
    const updateHeight = () => {
      if (sidebarRef.current) {
        setSidebarHeight(sidebarRef.current.offsetHeight);
      }
    };

    const handleClick = (event) => {
      if (flyoutMenuRef.current && !flyoutMenuRef.current.contains(event.target)) {
        setVisibleFlyout(undefined);
      }
      // fixme need to close when click outside
    };

    // Set initial height and add event listeners for window resize
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const toggleFlyout = (e) => {
    if (visibleFlyout === e.target.innerText) {
      setVisibleFlyout(undefined);
    } else {
      setVisibleFlyout(e.target.innerText);
    }
  };

  // Adjust flyout height to match the sidebar height when flyout is visible
  React.useEffect(() => {
    if (visibleFlyout && sidebarRef.current && flyoutMenuRef.current) {
      const sidebarHeight = sidebarRef.current.offsetHeight;
      flyoutMenuRef.current.style.height = `${sidebarHeight}px`;
      flyoutMenuRef.current.focus();
    }
  }, [visibleFlyout]);

  const renderContent = (visibleFlyout) => {
    if (isLoading) {
      return <FlyoutLoading />;
    }
    if (visibleFlyout === 'Assistants') {
      return (
        <FlyoutWizardProvider>
          <FlyoutWizard
            steps={[
              <FlyoutStartScreen
                key="assistant-start"
                title={FLYOUT_CONTENT[visibleFlyout].title}
                subtitle={FLYOUT_CONTENT[visibleFlyout].subtitle}
                primaryButtonText={FLYOUT_CONTENT[visibleFlyout].primaryButtonText}
                header="Assistants"
                hideFlyout={() => setVisibleFlyout(undefined)}
              />,
              <FlyoutForm key="assistant-form" header="New assistant" hideFlyout={() => setVisibleFlyout(undefined)} />,
              <FlyoutList
                key="assistant-list"
                header={
                  <div className="title-with-label">
                    {visibleFlyout} <Label variant="outline">2</Label>
                  </div>
                }
                hideFlyout={() => setVisibleFlyout(undefined)}
                buttonText="New assistant"
                typeWordPlural="assistants"
              />,
            ]}
          />
        </FlyoutWizardProvider>
      );
    } else {
      return (
        <FlyoutWizardProvider>
          <FlyoutWizard
            steps={[
              <FlyoutStartScreen
                key="files-start"
                title={FLYOUT_CONTENT[visibleFlyout].title}
                subtitle={FLYOUT_CONTENT[visibleFlyout].subtitle}
                primaryButtonText={FLYOUT_CONTENT[visibleFlyout].primaryButtonText}
                header="Files"
                hideFlyout={() => setVisibleFlyout(undefined)}
              />,
              <FlyoutList
                key="files-list"
                header={
                  <div className="title-with-label">
                    {visibleFlyout} <Label variant="outline">2</Label>
                  </div>
                }
                hideFlyout={() => setVisibleFlyout(undefined)}
                buttonText="Upload file"
                typeWordPlural="files"
                onFooterButtonClick={() => null}
              />,
            ]}
          />
        </FlyoutWizardProvider>
      );
    }
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

        <Nav id="nav-primary-simple" className="pf-c-nav" aria-label="Global">
          <NavList>
            <NavItem to="/">Home</NavItem>
            <NavItem
              to=""
              onClick={toggleFlyout}
              aria-haspopup="menu"
              aria-expanded={visibleFlyout !== null}
              isActive={visibleFlyout === 'Assistants'}
            >
              Assistants
            </NavItem>
            <NavItem
              to=""
              onClick={toggleFlyout}
              aria-haspopup="menu"
              aria-expanded={visibleFlyout !== null}
              isActive={visibleFlyout === 'Files'}
            >
              Files
            </NavItem>
          </NavList>
        </Nav>
        {/* Flyout menu */}
        {visibleFlyout && (
          <FlyoutMenu
            key={visibleFlyout}
            id={visibleFlyout}
            height={sidebarHeight}
            hideFlyout={() => setVisibleFlyout(undefined)}
          >
            {renderContent(visibleFlyout)}
          </FlyoutMenu>
        )}
      </div>
    </PageSidebar>
  );
};
