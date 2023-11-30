module.exports = {
	currentYear() {
		const today = new Date();
		return today.getFullYear();
	},
	currentDate() {
		const today = new Date();
		return today.toISOString();
	},
};
