import { LatLng } from './lat-lng';

export class AppDirectionService {
  private readonly directionService: google.maps.DirectionsService;
  private readonly renderer: google.maps.DirectionsRenderer;

  constructor(map: google.maps.Map) {
    this.directionService = new google.maps.DirectionsService();
    this.renderer = new google.maps.DirectionsRenderer();
    this.renderer.setMap(map);
    this.renderer.setOptions({
      markerOptions: {
        visible: false,
      },
      polylineOptions: {
        strokeColor: '#bb9e00',
        strokeWeight: 5,
        strokeOpacity: 0.6,
        geodesic: true,
      },
    });
  }

  async drawRoute(src: LatLng, dest: LatLng): Promise<void> {
    const route = await this.getRoute({
      origin: src,
      destination: dest,
      travelMode: google.maps.TravelMode.WALKING,
    });

    this.renderer.setDirections(route);
  }

  private getRoute(
    request: google.maps.DirectionsRequest
  ): Promise<google.maps.DirectionsResult> {
    return this.directionService.route(request);
  }
}
