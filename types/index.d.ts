type KeyTypes<T, K> = 
	T extends readonly unknown[] ? KeyTypes<T[number], K> :
	T extends Record<string, unknown> ? { [P in keyof T]: P extends K ? T[P] : KeyTypes<T[P], K> }[keyof T] : never

type ParamsType = Record<string, string|number>

type SearchType = string | ParamsType

interface RouteItem<E = unknown> {
	path: string
	extra?: E
}

type InjectNavRouteProps<RoutesNameType = string,E = unknown> = Array<{
	name: RoutesNameType
	routes?: InjectNavRouteProps<RoutesNameType,E>
} & RouteItem<E>>

interface LocationDescriptorObject<Name> {
	state?: unknown
	name: Name,
	params?: ParamsType
	search?: SearchType
}