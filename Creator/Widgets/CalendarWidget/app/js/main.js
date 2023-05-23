// import { mockData } from './mockData.js';
import { Calendar } from './calendar.js';
// import { hotelRevenueData } from './mockData.js';

const ready = callback => {
	if (document.readyState !== 'loading') callback();
	else if (document.addEventListener)
		document.addEventListener('DOMContentLoaded', callback);
	else
		document.attachEvent('onreadystatechange', function () {
			if (document.readyState === 'complete') callback();
		});
};

ready(async () => {
	const cal = Calendar('calendar');
	console.log("inside main");
	// console.log(hotelRevenueData);
	// cal.bindData(hotelRevenueData);
	cal.render();
});
