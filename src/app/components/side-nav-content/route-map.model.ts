export class RouteMap {
  public Label: string | undefined;
  public Route: string | undefined;
  public Active: boolean;
  public SubItems?: RouteMap[];
  public IsExpanded?: boolean;

  constructor(label: string, route: string, subItems?: RouteMap[]) {
    this.Label = label;
    this.Route = route;
    this.Active = false;
    this.SubItems = subItems;
    this.IsExpanded = false;
  }
}
