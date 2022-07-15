export interface RouteProps {
  name: string
  path: string
  Icon: React.ElementType
  type: "link" | "group"
  noBackground?: boolean
}

export interface RoutesArrayProps extends RouteProps {
  children?: RouteProps[]
}

export interface DeviceRoutes {
  width: number
  main: string[]
  more: string[]
  menu: string[]
}
