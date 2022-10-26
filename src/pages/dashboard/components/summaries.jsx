import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import productIcon from "../../../static/img/prod3.png";
import { cedisLocale } from "../../../helpers/utilities";

const ProductIcon = () =>
{
	return (
		<img
			src={ productIcon }
			alt=""
			style={ {
				height: "30px",
			} }
		/>
	);
};

const Summaries = ( {
	sales,
	expenses = 0,
	productCount = 0,
	productItems = 0,
} ) =>
{
	return (
		<div className="site-statistic-demo-card">
			<div className="row">
				<div className="col-md-3 col-12">
					<Card>
						<Statistic
							title="income"
							value={ cedisLocale.format( sales ) || 0 }
							precision={ 2 }
							valueStyle={ { color: "#3f8600" } }
							prefix={ <ArrowUpOutlined /> }
							suffix="₵"
						/>
					</Card>
				</div>
				<div className="col-md-3 col-12">
					<Card>
						<Statistic
							title="expenses"
							value={ cedisLocale.format( expenses ) || 0 }
							precision={ 2 }
							valueStyle={ { color: "#cf1322" } }
							prefix={ <ArrowDownOutlined /> }
							suffix="₵"
						/>
					</Card>
				</div>
				<div className="col-md-3 col-12">
					<Card>
						<Statistic
							title="number of products"
							prefix={ <ProductIcon /> }
							value={ productCount || 0 }
						/>
					</Card>
				</div>
				<div className="col-md-3 col-12">
					<Card>
						<Statistic
							title="product items count"
							prefix={ <ProductIcon /> }
							value={ productItems || 0 }
						/>
					</Card>
				</div>
			</div>
		</div>
		// <div className="row summary my-3">
		// 	<div className="col-md-3 col-12 box">
		// 		<h3 className="text-success">{cedisLocale.format(sales || 0)}</h3>
		// 		<small>sales (GHS)</small>
		// 	</div>
		// 	<div className="col-md-3 col-12 box">
		// 		<h3 className="text-danger">{cedisLocale.format(expenses)}</h3>
		// 		<small>expenses (GHS)</small>
		// 	</div>
		// 	<div className="col-md-3 col-12 box">
		// 		<h3 className="text-primary">{productCount}</h3>
		// 		<small>products</small>
		// 	</div>
		// 	<div className="col-md-3 col-12 box">
		// 		<h3 className="text-primary">{cedisLocale.format(productItems)}</h3>
		// 		<small>product items</small>
		// 	</div>
		// </div>
	);
};

export default Summaries;
