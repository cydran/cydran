interface PropertyKeysFields {
	CYDRAN_DIGEST_MAX_EVALUATIONS: string;
	CYDRAN_CLONE_MAX_EVALUATIONS: string;
	CYDRAN_EQUALS_MAX_EVALUATIONS: string;
	CYDRAN_PRODUCTION_ENABLED: string;
}

const PropertyKeys: PropertyKeysFields = {
	CYDRAN_DIGEST_MAX_EVALUATIONS: "cydran.digest.maxEvaluations",
	CYDRAN_CLONE_MAX_EVALUATIONS: "cydran.clone.maxEvaluations",
	CYDRAN_EQUALS_MAX_EVALUATIONS: "cydran.equals.maxEvaluations",
	CYDRAN_PRODUCTION_ENABLED: "cydran.production.enabled"
};

export default PropertyKeys;
