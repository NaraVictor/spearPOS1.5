import { Helmet } from "react-helmet";
import { constants } from "../helpers/config";

const PageTitle = ( { title } ) =>
{
	return (
		<Helmet>
			<title>
				{ title } - { constants.siteTitle }
			</title>
		</Helmet>
	);
};

export default PageTitle;
