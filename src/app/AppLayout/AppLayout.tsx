import * as React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Brand,
  Button,
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Page,
  SkipToContent,
} from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import logo from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Standard-RGB.svg';
import logoDark from '@app/bgimages/Logo-Red_Hat-Composer_AI_Studio-A-Reverse.svg';
import { SidebarWithFlyout } from '@app/SidebarWithFlyout/SidebarWithFlyout';

const AppLayout: React.FunctionComponent = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    const updateSidebar = () => {
      if (window.innerWidth >= 1200) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', updateSidebar);

    return () => {
      window.removeEventListener('resize', updateSidebar);
    };
  }, []);

  // set height of flyout to match nav
  React.useEffect(() => {
    const sourceElement = document.getElementById('nav-primary-simple');
    if (sourceElement) {
      const height = sourceElement.offsetHeight;

      const targetElements = document.getElementsByClassName('flyoutMenu');
      for (let i = 0; i < targetElements.length; i++) {
        (targetElements[i] as HTMLElement).style.height = `${height}px`;
      }
    }
  }, []);

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand data-codemods>
          <MastheadLogo data-codemods>
            <div className="show-light">
              <Brand src={logo} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
            </div>
            <div className="show-dark">
              <Brand src={logoDark} alt="Red Hat Composer AI Studio" heights={{ default: '36px' }} />
            </div>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const Sidebar = <SidebarWithFlyout />;

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer && primaryContentContainer.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );

  return (
    <Page
      mainContainerId={pageId}
      masthead={masthead}
      sidebar={sidebarOpen && Sidebar}
      skipToContent={PageSkipToContent}
      isContentFilled
    >
      <Outlet />
    </Page>
  );
};

export { AppLayout };
