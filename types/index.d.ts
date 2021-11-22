declare namespace NavSpace {

	type CONSTANT = string | number | symbol

	type OBJECT<T = unknown> = Record<CONSTANT, T>
	interface Props<ActionName = unknown, ExtraProps = unknown> {
		name: ActionName
		path: string
		params?: ExtraProps
	}
	
	interface NavigationProps<ActionName> {
		name: ActionName
		params?: OBJECT
		search?: OBJECT | string
		state?: OBJECT
	}
	
	type NavigationParams<ActionName> = [ActionName | NavigationProps<ActionName>, OBJECT?, (OBJECT|string)?, OBJECT?]
}