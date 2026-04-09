const PAYOUT_FORMATTER = new Intl.NumberFormat("en-US", {
	currency: "USD",
	maximumFractionDigits: 0,
	style: "currency",
});

export const formatMissionPayout = (payout: number) => {
	return PAYOUT_FORMATTER.format(payout);
};

export const getMissionRiskStyles = (riskLevel: number) => {
	if (riskLevel >= 7) {
		return "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300";
	}

	if (riskLevel >= 4) {
		return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
	}

	return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
};
