interface RefreshStrategy {

	refresh(current: unknown[]): void;

}

export default RefreshStrategy;
