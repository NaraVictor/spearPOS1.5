import PageTitle from "./../../components/page-title";
import { PageHeader } from "antd";
import { POS } from "./pos";
import { useState, useEffect } from "react";
import { fetchData } from "../../helpers/api";
import WelcomePage from "./welcome";
const PosPage = ( props ) =>
{
	const [ page, setPage ] = useState( 0 );
	const [ selected, setSelected ] = useState( {} ); //selected category
	const [ categories, setCategories ] = useState( {} ); //categories

	// data fetching
	const fetchCategories = () =>
	{
		fetchData( "categories?count_products=yes&type=product" ).then(
			( res ) => res.status === 200 && setCategories( res.data.data )
		);
	};

	useEffect( () =>
	{
		fetchCategories();
	}, [] );

	return (
		<div className="content-container">
			<PageTitle title="PoS - Point of Sale" />
			<div className="row">
				{/* <div className="col-12 mx-auto"> */ }
				{/* <div className="d-flex align-items-center justify-content-between my-4"> */ }
				<PageHeader
					ghost={ false }
					title="PoS - Point of Sale"
					className="site-page-header text-white bg-white"
					onBack={ () => window.history.go( -1 ) }
					subTitle="record a sale transaction. Warning: any transaction committed affects stock levels"></PageHeader>
				{/* <Button
							type="primary"
							size="large"
							className="d-flex align-items-center ">
							<ArrowLeftOutlined />
							Exit
						</Button> */}
				{/* </div> */ }
				{/* </div> */ }
			</div>
			<div className="row">
				<div className="col-12">
					<div className="shadow-sm bg-white p-3">
						{ page === 0 && (
							<WelcomePage
								categories={ categories }
								onSelect={ ( s ) =>
								{
									setSelected( s );
									setPage( 1 );
								} }
							/>
						) }
						{ page === 1 && (
							<POS
								category={ selected }
								categories={ categories }
								onExit={ () => setPage( 0 ) }
							/>
						) }
					</div>
				</div>
			</div>
		</div>
	);
};

export { PosPage };
