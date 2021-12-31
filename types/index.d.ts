declare namespace NavSpace {

	type CONSTANT = string | number | symbol

	type OBJECT<T = unknown> = Record<CONSTANT, T>

	type Params = OBJECT
	type Serach = OBJECT | string
	type State = OBJECT

	interface Props<ActionName = unknown, ExtraProps = unknown> {
		name: ActionName
		path: string
		extra?: ExtraProps
	}
	
	interface NavigationProps<ActionName> {
		name: ActionName
		params?: Params
		search?: Serach
		state?: State
	}
	
	type NavigationParams<ActionName> = ActionName | NavigationProps<ActionName> | [ActionName, (Params | null)?, (Serach | null)? , State?]

}