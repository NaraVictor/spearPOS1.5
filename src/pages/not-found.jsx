import PageTitle from "../components/page-title";
import lostImg from "../static/img/lost.svg"

const NotFoundPage = ( props ) =>
{
	return (
		<div className="text-center mt-5">
			<PageTitle title="404 Resource not found" />
			<img src={ lostImg } width="400" height="400" />
			<h1>Oops!</h1>
			<h4>Resource not found</h4>
			<a href="#" onClick={ () => props.history.push( "/" ) }>
				Go back
			</a>
		</div>
	);
};

export default NotFoundPage;
