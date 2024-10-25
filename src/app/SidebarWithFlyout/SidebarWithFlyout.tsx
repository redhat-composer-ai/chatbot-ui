import React, { useEffect, useRef, useState } from 'react';
import { Brand, Label, Nav, NavItem, NavList, PageSidebar } from '@patternfly/react-core';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';
import { FlyoutHeader } from '@app/FlyoutHeader.tsx/FlyoutHeader';
import { FlyoutStartScreen } from '@app/FlyoutStartScreen.tsx/FlyoutStartScreen';
import { FlyoutMenu } from './FlyoutMenu';
import { FlyoutForm } from '@app/FlyoutForm/FlyoutForm';
import { FlyoutLoading } from '@app/FlyoutLoading/FlyoutLoading';
import { FlyoutList } from '@app/FlyoutList/FlyoutList';

export const SidebarWithFlyout: React.FunctionComponent = () => {
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [showStart, setShowStart] = useState(true);
  const [showCreateAssistant, setShowCreateAssistant] = useState(false);
  const [showList, setShowList] = useState(true);
  const [visibleFlyout, setVisibleFlyout] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const flyoutMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const FLYOUT_CONTENT = {
    Assistants: {
      title: 'Create your first assistant',
      subtitle: 'Work smarter and faster with tailored assistance',
      primaryButtonText: 'Create assistant',
      onPrimaryButtonClick: () => {
        setShowCreateAssistant(true);
        setShowStart(false);
      },
    },
    Files: {
      title: 'Upload your first file',
      subtitle: 'Analyze information and streamline workflows',
      primaryButtonText: 'Upload files',
    },
  };

  useEffect(() => {
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
  useEffect(() => {
    if (visibleFlyout && sidebarRef.current && flyoutMenuRef.current) {
      const sidebarHeight = sidebarRef.current.offsetHeight;
      flyoutMenuRef.current.style.height = `${sidebarHeight}px`;
      flyoutMenuRef.current.focus();
    }
  }, [visibleFlyout]);

  const renderTitle = (visibleFlyout) => {
    if (showCreateAssistant) {
      return 'New assistant';
    }
    if (showList) {
      return (
        <div className="title-with-label">
          Assistants <Label variant="outline">2</Label>
        </div>
      );
    }
    return visibleFlyout;
  };

  const renderContent = (visibleFlyout) => {
    return <FlyoutList />;
    if (isLoading) {
      return <FlyoutLoading />;
    }
    if (showStart) {
      return (
        <FlyoutStartScreen
          title={FLYOUT_CONTENT[visibleFlyout].title}
          subtitle={FLYOUT_CONTENT[visibleFlyout].subtitle}
          primaryButtonText={FLYOUT_CONTENT[visibleFlyout].primaryButtonText}
          onPrimaryButtonClick={FLYOUT_CONTENT[visibleFlyout].onPrimaryButtonClick}
        />
      );
    }
    if (showCreateAssistant) {
      return <FlyoutForm />;
    }
    return <div>List of assistants</div>;
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
              // button would make more sense
              // probably something easier to look at it.
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
            <FlyoutHeader title={renderTitle(visibleFlyout)} hideFlyout={() => setVisibleFlyout(undefined)} />
            {renderContent(visibleFlyout)}
          </FlyoutMenu>
        )}
      </div>
    </PageSidebar>
  );
};
