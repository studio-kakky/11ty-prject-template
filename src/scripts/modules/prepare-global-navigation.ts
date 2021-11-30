const toggle = (container: Element) => {
  container.classList.toggle('-open');
};

const close = (container: Element) => {
  container.classList.remove('-open');
};

export const prepareGlobalNavigation = (el: Element): void => {
  if (!el) {
    return;
  }

  const trigger = el.querySelector('[data-global-navigation-trigger]');
  const links = el.querySelectorAll('.GlobalNavigationItem_link');
  const container = el.querySelector('[data-global-navigation-items]');

  if (!trigger || !container) {
    return;
  }

  trigger.addEventListener('click', () => {
    toggle(container);
  });

  Array.from(links).forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const link = target.getAttribute('href') || '';
      if (!/^#.*/.test(link) && link !== '/') {
        close(container);
        return;
      }

      event.preventDefault();

      const targetElement =
        link != '/' ? document.querySelector(link) : document.body;
      if (targetElement) {
        targetElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
      close(container);
    });
  });
};
