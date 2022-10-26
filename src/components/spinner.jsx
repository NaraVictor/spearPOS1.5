const Spinner1 = ( props ) =>
{
	return (
		<div className="spinner">
			<div className="dot1"></div>
			<div className="dot2"></div>
		</div>
	);
};

const Spinner2 = ( props ) =>
{
	return (
		<div className="sk-chase">
			<div className="sk-chase-dot"></div>
			<div className="sk-chase-dot"></div>
			<div className="sk-chase-dot"></div>
			<div className="sk-chase-dot"></div>
			<div className="sk-chase-dot"></div>
			<div className="sk-chase-dot"></div>
		</div>
	);
};

export { Spinner1, Spinner2 };
