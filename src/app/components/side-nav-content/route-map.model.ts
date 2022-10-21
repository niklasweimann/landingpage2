export class RouteMap {
  public Label: string | undefined;
  public Route: string | undefined;
  public Active: boolean;

  constructor(label: string, route: string) {
    this.Label = label;
    this.Route = route;
    this.Active = false;
  }
}
