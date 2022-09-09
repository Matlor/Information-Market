export const checkIfCaseTrue = (
	targetStatus,
	targetUser,
	currentStatus,
	currentUserRole
) => {
	if (targetStatus === currentStatus || targetStatus === "any") {
		if (targetUser === currentUserRole || targetUser === "any") {
			return true;
		}
	}

	return false;
};
