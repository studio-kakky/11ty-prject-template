import { prepareGlobalNavigation } from './modules/prepare-global-navigation';
import { embedMovie } from './modules/embed-movie';
import { youtubeOption } from './constants';
import { embedMap } from './modules/embed-map';
import smoothscroll from 'smoothscroll-polyfill';
import { ImageGallery } from './modules/gallery';

// kick off the polyfill!
smoothscroll.polyfill();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('DOMContentLoaded', async () => {
  const globalNavi = document.querySelector('.GlobalNavigation');
  prepareGlobalNavigation(globalNavi as Element);

  const movieWrapper = document.querySelector('#Movie') as HTMLElement;
  const movieContainer = movieWrapper.querySelector(
    '#MovieContainer'
  ) as HTMLElement;
  await embedMovie(movieWrapper, movieContainer, youtubeOption);

  const mapContainer = document.querySelector('#MapContainer') as HTMLElement;
  const lang = /^\/en*/.test(window.location.pathname) ? 'en' : 'jp';
  await embedMap(mapContainer, lang);

  const photoNode = document.querySelectorAll('[data-gallery-item]');
  const images = Array.from(photoNode).map((v) => {
    return {
      src: (v as HTMLElement).dataset.galleryImg as string,
      alt: '',
    };
  });

  const gallery = new ImageGallery(
    images,
    document.querySelector('.Gallery') as HTMLElement
  );

  Array.from(photoNode).forEach((el, idx) => {
    el.addEventListener('click', () => {
      gallery.show(idx + 1);
    });
  });
});
