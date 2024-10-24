// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { Brand, Button, FocusTrap, Nav, NavItem, NavList, PageSidebar } from '@patternfly/react-core';
import FlyoutStartScreen from '@app/FlyoutStartScreen.tsx/FlyoutStartScreen';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';

const FlyoutHeader = ({ title, hideFlyout }) => {
  return (
    <div className="flyout-header">
      {title}{' '}
      <Button onClick={hideFlyout} variant="plain">
        x
      </Button>
    </div>
  );
};
const FlyoutMenu = ({ id, height, children, hideFlyout }) => {
  const previouslyFocusedElement = React.useRef(null);

  const handleFlyout = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      hideFlyout();
    }
  };

  const focusTrapProps = {
    tabIndex: -1,
    'aria-modal': true,
    role: 'dialog',
    active: true,
    'aria-labelledby': id,
    focusTrapOptions: {
      //fallbackFocus: () => panel.current,
      onActivate: () => {
        if (previouslyFocusedElement.current !== document.activeElement) {
          previouslyFocusedElement.current = document.activeElement;
        }
      },
      onDeactivate: () => {
        previouslyFocusedElement.current &&
          previouslyFocusedElement.current.focus &&
          previouslyFocusedElement.current.focus();
      },
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: false,
      // FocusTrap's initialFocus can accept false as a value to prevent initial focus.
      // We want to prevent this in case false is ever passed in.
      initialFocus: undefined,
      escapeDeactivates: false,
    },
  };

  return (
    <FocusTrap
      id={id}
      className="flyout-menu"
      style={{
        height: `${height}px`,
      }}
      onKeyDown={handleFlyout}
      {...focusTrapProps}
    >
      {children}
    </FocusTrap>
  );
};

const SidebarWithFlyout = () => {
  const [visibleFlyout, setVisibleFlyout] = useState(null);
  const sidebarRef = useRef(null);
  const flyoutMenuRef = useRef(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (sidebarRef.current) {
        setSidebarHeight(sidebarRef.current.offsetHeight);
      }
    };

    const handleClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setVisibleFlyout(null);
      }
    };

    // Set initial height and add event listeners for window resize
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const toggleFlyout = (e) => {
    if (visibleFlyout === e.target.innerText) {
      setVisibleFlyout(null);
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
              isActive={visibleFlyout === 'Chats'}
              // button would make more sense
              // probably something easier to look at it.
            >
              Chats
            </NavItem>
            <NavItem
              to=""
              onClick={toggleFlyout}
              aria-haspopup="menu"
              aria-expanded={visibleFlyout !== null}
              isActive={visibleFlyout === 'Assistants'}
            >
              Assistants
            </NavItem>
          </NavList>
        </Nav>
        {/* Flyout menu */}
        {visibleFlyout && (
          <FlyoutMenu
            key={visibleFlyout}
            id={visibleFlyout}
            height={sidebarHeight}
            hideFlyout={() => setVisibleFlyout(null)}
          >
            <FlyoutHeader title={visibleFlyout} hideFlyout={() => setVisibleFlyout(null)} />
            <FlyoutStartScreen title="test" subtitle="test" primaryButtonText="test" />
          </FlyoutMenu>
        )}
      </div>
    </PageSidebar>
  );
};

export default SidebarWithFlyout;
