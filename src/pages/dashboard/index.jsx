import PageTitle from "./../../components/page-title";
import Summaries from "./components/summaries";
import { useEffect, useState } from "react";
import {
	cedisLocale,
	getExpiredProds,
	openNotification,
	populateLowStock,
} from "../../helpers/utilities";
import { fetchData } from "../../helpers/api";
import arraySort from "array-sort";
import { Line } from "react-chartjs-2";
import { salesChartData } from "../../helpers/charts-data";
import { ErrorBoundary } from '../../components/error-boundary'
// icons
import productIcon from "../../static/img/prod.png";
import saleIcon from "../../static/img/sell3.png";
import restockIcon from "../../static/img/purchase3.png";
import expenseIcon from "../../static/img/spend.png";
import ExpenseForm from "./../../components/expense";
import ProductForm from "./../../components/product";
import LowStocks from "../../components/low-stocks";
import { Link } from "react-router-dom";
import FrequentlyPurchased from "./../../components/frequently-purchased";
import { expensesChartData } from "../../helpers/charts-data";
import { getRole } from "../../helpers/auth";
import _ from "lodash";

// antd
import { PageHeader, Button, Modal, Space, Tag } from "antd";
import ExpiringProds from "../../components/expiring-prods";
import { format } from "date-fns";
// import { ErrorBoundary } from "react-error-boundary";

const DashboardPage = ( props ) => {
	// TODO: Refactor some of the states into an object
	const [ products, setProducts ] = useState( [] );
	const [ chart, setChart ] = useState( 0 );
	const [ popular, setPopular ] = useState( [] );
	const [ sales, setSales ] = useState( {
		list: [],
		sum: 0,
		dailySales: [],
		dailyExpenses: [],
	} );
	const [ lowStock, setLowStock ] = useState( [] );
	const [ expired, setExpired ] = useState( [] );
	const [ totalItems, setItems ] = useState( 0 );
	const [ expenses, setExpenses ] = useState( 0 );

	const [ modal, setModal ] = useState( {
		isVisible: false,
		content: "",
		title: "",
		width: "",
	} );

	const sumItems = ( prods ) => {
		let sum = 0;
		prods.map( ( p ) => ( sum = sum + p.quantity ) );
		setItems( () => sum );
	};

	const getPopularProducts = (
		prods,
		updateList = false,
		limited = true,
		limit = 10
	) => {
		// sort products by salesCount
		if ( _.isEmpty( prods ) ) return;
		const sortedProducts = arraySort( prods, "salesCount", { reverse: true } );

		if ( limited ) {
			let count = 0;
			const list = [];

			if ( sortedProducts.length < limit ) {
				list.push( ...sortedProducts );
			} else {
				while ( list.length < limit ) {
					list.push( sortedProducts[ count ] );
					count++;
				}
			}

			updateList && setPopular( () => list );
			return list;
		}

		updateList && setPopular( () => sortedProducts );
		return sortedProducts;
	};

	const getTopLowStock = ( top ) => {
		const low = [];
		if ( lowStock.length === 0 ) return low;

		if ( lowStock.length >= top ) {
			let count = 0;
			while ( low.length < top ) {
				low.push( lowStock[ count ] );
				++count;
			}
		} else {
			low.push( ...lowStock );
		}

		return low;
	};

	const getRecentSales = ( top ) => {
		const recentSales = [];
		if ( sales.list.length === 0 ) return recentSales;

		if ( sales.list.length >= top ) {
			let count = 0;
			while ( recentSales.length < top ) {
				recentSales.push( sales.list[ count ] );
				++count;
			}
		} else {
			recentSales.push( ...sales.list );
		}
		return recentSales;
	};

	const getExpired = ( count ) => {
		try {

			if ( _.isEmpty( expired ) )
				return []

			if ( expired.length > count )
				return expired.slice( 0, count );

			return expired
		}
		catch ( ex ) {
			openNotification( "System error", ex, "error" );
			console.log( "error ", ex );
		}
	};

	const showModal = ( title, content, width ) => {
		setModal( {
			content,
			title,
			isVisible: true,
			width,
		} );
	};

	const handleCancel = () => {
		setModal( {
			...modal,
			isVisible: false,
		} );
	};

	const calcSaleSum = ( sales ) => {
		let sum = 0;
		sales.forEach( ( s ) => {
			sum += parseFloat( s.sumAmt );
		} );
		return sum;
	};

	useEffect( () => {
		fetchData( "products" ).then( ( res ) => {
			if ( res.status === 200 ) {
				if ( !_.isEmpty( res.data.data ) ) {
					setProducts( res.data.data );
					sumItems( res.data.data );
					const { lowStocks } = populateLowStock( res.data.data );
					setLowStock( lowStocks );
					getPopularProducts( res.data.data, true );
					setExpired( getExpiredProds( res.data.data ) )
				}
			}
		} );

		fetchData( "dashboard" ).then( ( res ) => {
			if ( res.status === 200 ) {
				if ( !_.isEmpty( res.data.data ) ) {
					setExpenses( res.data.data.expenses );
					setSales( {
						list: res.data.data.sales,
						sum: calcSaleSum( res.data.data.sales ),
						dailySales: res.data.data.dailySales,
						dailyExpenses: res.data.data.dailyExpenses,
					} );
				}
			}
		} );
	}, [] );

	return (
		<div className="content-container">
			<Modal
				title={ modal.title }
				visible={ modal.isVisible }
				footer={ null }
				onCancel={ handleCancel }
				width={ modal.width && modal.width }>
				{ modal.content }
			</Modal>
			<PageTitle title="Dashboard" />

			<div className="bg-white">
				<h6 className="bg-green text-white text-center p-2">
					What do you want to do?
				</h6>
				<Space className="d-flex justify-content-around pb-1 px-5">

					<Link to="/pos" className="btn">
						<div>
							<img src={ saleIcon } alt="" height="70" className="ps-3" />
						</div>
						sell
						{/* <br />  items */ }
					</Link>
					<button
						className="btn"
						onClick={ () => showModal( "Add Expense", <ExpenseForm /> ) }>
						<div>
							<img src={ expenseIcon } alt="" height="70" className="ps-3" />
						</div>
						spend
					</button>
					{ getRole() !== "attendant" && (
						<>
							{ getRole() !== "accounts" && (
								<button
									className="btn"
									onClick={ () => showModal( "Add Product", <ProductForm /> ) }>

									<div>
										<img src={ productIcon } alt="" height="70" className="ps-3" />
									</div>
									add product
								</button>
							) }

							<Link
								to="/inventory/purchase-orders/new"
								className="btn">
								<div>
									<img src={ restockIcon } alt="" height="70" className="ps-3" />
								</div>
								restock
							</Link>
						</>
					) }
				</Space>
			</div>
			<div className="my-4">
				{ getRole() !== "attendant" && (
					<ErrorBoundary
					>
						<Summaries
							productCount={ products.length }
							productItems={ totalItems }
							expenses={ expenses }
							sales={ sales.sum }
						/>
					</ErrorBoundary>

				) }
			</div>

			{/* sales chart and low stock */ }
			<div className="row">
				<div className="col-md-9 col-12">
					<div className="bg-white p-3">
						<div className="btn-group btn-group-toggle mb-2" data-toggle="buttons">
							<label
								onClick={ () => setChart( () => 0 ) }
								className={ `btn btn-sm btn-outline-secondary ${ chart === 0 && "active"
									}` }>
								sales chart
							</label>
							<label
								onClick={ () => setChart( () => 1 ) }
								className={ `btn btn-sm btn-outline-secondary ${ chart === 1 && "active"
									}` }>
								expenses chart
							</label>
						</div>
						{ chart === 0 && (
							<>
								<h6>Sales chart</h6>
								<Line
									data={ salesChartData( sales?.dailySales ) }
									height={ 80 }
									width={ 200 }
								/>
							</>
						) }
						{ chart === 1 && (
							<>
								<h6>Expenses chart</h6>
								{/* <h6>THIS IS A PRO FEATURE</h6> */ }
								<Line
									data={ expensesChartData( sales?.dailyExpenses ) }
									height={ 80 }
									width={ 200 }
								/>
							</>
						) }
					</div>
				</div>
				<div className="col-md-3 col-12">
					<div className="bg-white p-3">
						<div className="d-flex justify-content-between align-items-center">
							<h6>Low stocks</h6>
							<Button
								type="primary"
								onClick={ () => {
									showModal( "Low Stocks", <LowStocks products={ lowStock } /> );
								} }>
								more
							</Button>
						</div>
						<hr />
						<table className="table table-hover">
							<tbody>
								<ErrorBoundary
								>
									{ getTopLowStock( 5 )?.map( ( p ) => (
										<tr key={ p.id }>
											<td>{ p?.productName }</td>
											<td>
												<strong>{ p?.quantity }</strong>
											</td>
										</tr>
									) ) }
								</ErrorBoundary>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-md-9 col-12">
					<div className="bg-white p-3">
						<div className="d-flex align-items-center justify-content-between my-4">
							<PageHeader
								ghost={ false }
								title="Frequently Purchased"
								subTitle="top 10 'fast-moving' products by unique sales"></PageHeader>
							<Button
								type="primary"
								onClick={ () =>
									showModal(
										"Purchase Frequency",
										<FrequentlyPurchased
											prods={ getPopularProducts( products, false, false ) }
											showModal={ showModal }
										/>,
										"700"
									)
								}>
								View All
							</Button>
						</div>
						<FrequentlyPurchased prods={ popular } onShowModal={ showModal } />
					</div>
				</div>
				<div className="col-md-3 col-12">
					<div className="bg-white p-3">
						<div className="d-flex justify-content-between align-items-center">
							<h6>
								<strong>Recent Sales</strong>
							</h6>
							<Button type="primary">
								<Link to="/inventory/sales">
									more
								</Link>
							</Button>
						</div>
						<table className="table table-hover">
							<thead>
								<tr>
									<td>Receipt#</td>
									<td>Items #</td>
									<td>Sum</td>
								</tr>
							</thead>
							<tbody>
								<ErrorBoundary
								>
									{ sales?.list?.length > 0 &&
										getRecentSales( 5 )?.map( ( s ) => (
											<tr key={ s.id }>
												<td>{ s?.receiptNumber }</td>
												<td>{ s?.details.length }</td>
												<td>{ cedisLocale.format( s?.sumAmt ) }</td>
											</tr>
										) ) }
								</ErrorBoundary>
							</tbody>
						</table>
					</div>

					{/* expired products */ }
					{
						!_.isEmpty( expired ) &&
						<div className="bg-white p-3 mt-4">
							<div className="d-flex justify-content-between align-items-center">
								<h6><strong>Expiring(ed)</strong></h6>
								<Button
									type="primary"
									onClick={ () => {
										showModal( "Expiring(ed) Products", <ExpiringProds products={ expired } /> );
									} }>
									more
								</Button>
							</div>
							<hr />
							<table className="table table-hover">
								<tbody>
									<ErrorBoundary>
										{ getExpired( 5 )?.map( ( p ) => (
											<tr key={ p.id }>
												<td>{ p?.productName }</td>
												<td>
													<strong>{ format( new Date( p?.expiryDate ),
														"MMMM dd, yy"
													) }</strong>
												</td>
											</tr>
										) ) }
									</ErrorBoundary>
								</tbody>
							</table>
						</div>

					}

				</div>
			</div>
		</div>
	);
};

export { DashboardPage };
