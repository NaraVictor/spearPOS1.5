import PageTitle from "../components/page-title";
import { useHistory } from "react-router-dom";

const NotAuthorized = ( props ) =>
{
	const history = useHistory();
	return (
		<div className="text-center mt-5 w-25 mx-auto">
			<PageTitle title="Access Denied" />
			<div className="bg-white rounded shadow">
				<h1 className="bg-danger text-white p-3">Access Denied</h1>
				<h4 className="p-3">You are not authorized to access this resource</h4>
				<div className="py-4">
					<a
						href="#"
						className="btn btn-success"
						onClick={ () => history.push( "/" ) }>
						Take me home!
					</a>
				</div>
			</div>
		</div >
	);
};

export default NotAuthorized;
