var x;
const JSType = {
	STR: typeof "",
	BOOL: typeof true,
	BIGINT: typeof BigInt(0),
	NUM: typeof 0,
	SYM: typeof Symbol("x"),
	FN: typeof (() => {}),
	OBJ: typeof {},
	UND: typeof x
} as const;

export default JSType;
