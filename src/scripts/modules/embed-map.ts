import { Loader } from '@googlemaps/js-api-loader';
import {
  defaultCenter,
  mapApiKey,
  position,
  stationPositions,
} from '../constants';
import Marker = google.maps.Marker;
import { AppDirectionService } from './direction-service';

const loadApi = (): Promise<typeof google> => {
  const loader = new Loader({
    apiKey: mapApiKey,
    version: 'weekly',
  });

  return loader.load();
};

const makeStationMarkers = (lang = 'jp'): Marker[] => {
  const isJp = lang === 'jp';

  return [
    new google.maps.Marker({
      position: stationPositions.roppongi7,
      title: isJp
        ? '都営大江戸線 六本木 7出口'
        : 'Roppongi (Toei Oedo Line) Exit #7',
      icon: {
        url: isJp
          ? '/assets/images/ooedo_roppongi_exit7_jp.svg'
          : '/assets/images/ooedo_roppongi_exit7_en.svg',
        anchor: new google.maps.Point(0, 12),
      },
    }),

    new google.maps.Marker({
      position: stationPositions.roppongi4a,
      title: isJp
        ? '日比谷線 六本木 4a出口'
        : 'Roppongi (Tokyo Metro Hibiya Line) Exit #4a',
      icon: {
        url: isJp
          ? '/assets/images/hibiya_roppongi_exit4a_jp.svg'
          : '/assets/images/hibiya_roppongi_exit4a_en.svg',
        anchor: new google.maps.Point(0, 12),
      },
    }),

    new google.maps.Marker({
      position: stationPositions.nogizaka3,
      title: isJp
        ? '千代田線 乃木坂 3出口'
        : 'Nogizaka (Tokyo Metro Chiyoda Line) Exit #3',
      icon: {
        url: isJp
          ? '/assets/images/tiyoda_nogizaka_exit3_jp.svg'
          : '/assets/images/tiyoda_nogizaka_exit3_en.svg',
        anchor: new google.maps.Point(0, 12),
      },
    }),
  ];
};

export const embedMap = async (
  container: HTMLElement,
  lang = 'jp'
): Promise<void> => {
  const google = await loadApi();
  const zoom = window.innerWidth > 600 ? 17 : 16;
  const map = new google.maps.Map(container, {
    center: defaultCenter,
    disableDefaultUI: true,
    zoom,
    mapId: '40b89c8dac7b7e51',
    keyboardShortcuts: false,
  });

  new google.maps.Marker({
    position: position,
    map,
    title: '現在地',
    icon: {
      url: '/assets/images/currentPosition.svg',
      anchor: new google.maps.Point(40, 57),
    },
  });

  const directionService = new AppDirectionService(map);

  const stations = makeStationMarkers(lang);
  stations.forEach((marker) => {
    marker.setMap(map);
    marker.addListener('click', async () => {
      const markerPosition = marker.getPosition();
      if (!markerPosition) {
        return;
      }
      await directionService.drawRoute(
        { lat: markerPosition.lat(), lng: markerPosition.lng() },
        position
      );
    });
  });

  map.addListener('zoom_changed', () => {
    const currentZoom = map.getZoom();
    if (currentZoom === undefined || currentZoom > 14) {
      stations.forEach((v) => v.setVisible(true));
      return;
    }

    stations.forEach((v) => v.setVisible(false));
  });
};
