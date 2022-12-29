import { Divider, Card, Statistic } from "antd";
import { isRegisterOpen } from "../../helpers/utilities";
import lostImg from "../../static/img/lost.svg"
import { Link } from 'react-router-dom'


const WelcomePage = ( { categories, onSelect } ) =>
{
	return (
		<div style={ { minHeight: "70vh" } }>
			<div className="mx-5">
				{/* <h3 className="my-0 text-success">Welcome</h3> */ }

			</div>
			<div className="row px-5">

				{
					!isRegisterOpen() ?
						<div className="text-center">
							<img src={ lostImg } width="300" height="300" alt="puppy looking hopelessly into tree" />
							<h6>Register is closed</h6>
							<button className="btn btn-primary btn-lg">
								<Link to="/register" className="text-white">
									OPEN REGISTER
								</Link>
							</button>
						</div> :
						categories.length > 0 &&

						<>
							<p className="mt-2 d-block">select category to proceed</p>
							<Divider />
							{ categories.map(
								( c ) =>
									c.products.length > 0 && (
										<div className="col-4" key={ c.name }>
											<Card
												className="category-selector-card"
												onClick={ () => onSelect( c ) }>
												<Statistic
													title={ `${ c.products.length } products` }
													value={ c.name }
												/>
											</Card>
										</div>
									)
							) }
						</>
				}
			</div>
		</div>
	);
};

export default WelcomePage;
