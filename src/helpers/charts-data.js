import { format } from "date-fns";
import arraySort from "array-sort";
import _ from "lodash";
export const Products = [];

export const salesChartData = (sales) => {
	const sortedList = arraySort(sales, "saleDate");
	let finalList = [];
	if (sortedList.length > 6) {
		let counter = 1;
		while (counter < 7) {
			finalList.unshift(sortedList[sortedList.length - counter]);
			++counter;
		}
	} else {
		finalList = sortedList;
	}

	const chartLabels = finalList.map((s) =>
		format(new Date(s.saleDate), "EEE, MMM d")
	);
	const values = finalList.map((s) => s.total_amount);
	return {
		labels: chartLabels,
		datasets: [
			{
				label: "Sales",
				data: values,
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
				],
				borderWidth: 1,
			},
		],
	};
};

export const expensesChartData = (expenses) => {
	const sortedExpenses = arraySort(expenses, "date");
	let finalList = [];
	if (sortedExpenses.length > 6) {
		let counter = 1;
		while (counter < 7) {
			finalList.unshift(sortedExpenses[sortedExpenses.length - counter]);
			++counter;
		}
	} else {
		finalList = sortedExpenses;
	}

	const chartLabels = finalList.map((e) =>
		format(new Date(e.date), "EEE, MMM d")
	);
	const values = finalList.map((e) => e.total_amount);
	return {
		labels: chartLabels,
		datasets: [
			{
				label: "Expenses",
				data: values,
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
				],
				borderWidth: 1,
			},
		],
	};
};

export const salesCountChartData = (products) => {
	const labels = products
		.filter((p) => p.salesCount > 0)
		.map((l) => l.productName);
	const values = products
		.filter((p) => p.salesCount > 0)
		.map((v) => v.salesCount);

	return {
		data: {
			labels: labels,
			datasets: [
				{
					label: "Products Sales Count",
					data: values,
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(255, 159, 64, 0.2)",
						"rgba(255, 205, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(201, 203, 207, 0.2)",
					],
					borderColor: [
						"rgb(255, 99, 132)",
						"rgb(255, 159, 64)",
						"rgb(255, 205, 86)",
						"rgb(75, 192, 192)",
						"rgb(54, 162, 235)",
						"rgb(153, 102, 255)",
						"rgb(201, 203, 207)",
					],
					borderWidth: 1,
				},
			],
		},

		config: {
			type: "bar",
			data: values,
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		},
	};
};

export const categorySalesChartData = (data) => {
	// console.log("data received ", data);
	// return;
	const cats = data
		?.filter((d) => d.products.length > 0)
		.map((c) => {
			let sum = 0;

			let obj = {
				name: c.name,
				sum: 0,
			};

			//look for products with sales records
			c.products.map((p) => {
				if (p.sales.length > 0)
					p.sales.forEach((s) => {
						sum += parseInt(s.quantity) * parseFloat(s.unitPrice);
						return (obj.sum = sum);
					});
			});
			return obj;
		});

	const labels = cats.map((c) => c.name);
	const values = cats.map((c) => c.sum);

	// console.log("transformed categories ", cats);

	return {
		data: {
			labels: labels,
			datasets: [
				{
					label: "Sales by Category",
					data: values,
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(255, 159, 64, 0.2)",
						"rgba(255, 205, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(201, 203, 207, 0.2)",
					],
					borderColor: [
						"rgb(255, 99, 132)",
						"rgb(255, 159, 64)",
						"rgb(255, 205, 86)",
						"rgb(75, 192, 192)",
						"rgb(54, 162, 235)",
						"rgb(153, 102, 255)",
						"rgb(201, 203, 207)",
					],
					borderWidth: 1,
				},
			],
		},
		config: {
			type: "bar",
			data: values,
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		},
	};
};

export const incomeExpenseChartData = (dataSource) => {
	let income = dataSource.income?.filter((i) => !_.isEmpty(i.total_amount));
	let expenses = dataSource.expenses?.filter((e) => !_.isEmpty(e.total_amount));

	// group data into month and year then total amounts

	// console.log("data source ", dataSource);
	// console.log("income n expenses ", income, expenses);
	const data = {
		income: income?.map((i) => i.total_amount),
		expenses: expenses?.map((e) => e.total_amount),
	};
	const labels = {
		income: income?.map((i) => i.saleDate),
		expenses: expenses?.map((e) => e.date),
	};

	return {
		data: {
			labels: labels.income,
			datasets: [
				{
					label: "Income",
					data: data.income,
					borderColor: [
						"rgb(9, 9, 9)",
						"rgb(9, 9, 9)",
						"rgb(9, 9, 9)",
						"rgb(9, 9, 9)",
						"rgb(9, 9, 9)",
						"rgb(9, 9, 9)",
						"rgb(9, 9, 9)",
					],
					backgroundColor: [
						"rgba(50, 200, 50, 0.5)",
						"rgba(50, 200, 50, 0.5)",
						"rgba(50, 200, 50, 0.5)",
						"rgba(50, 200, 50, 0.5)",
						"rgba(50, 200, 50, 0.5)",
						"rgba(50, 200, 50, 0.5)",
						"rgba(50, 200, 50, 0.5)",
					],
				},
				{
					label: "Expense",
					data: data.expenses,
					borderColor: [
						"rgb(255, 99, 132)",
						"rgb(255, 159, 64)",
						"rgb(255, 205, 86)",
						"rgb(75, 192, 192)",
						"rgb(54, 162, 235)",
						"rgb(153, 102, 255)",
						"rgb(201, 203, 207)",
					],
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(255, 159, 64, 0.2)",
						"rgba(255, 205, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(201, 203, 207, 0.2)",
					],
				},
			],
		},

		config: {
			type: "bar",
			data,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: "top",
					},
					title: {
						display: true,
						text: "Income Expenditure Chart",
					},
				},
			},
		},
	};
};
