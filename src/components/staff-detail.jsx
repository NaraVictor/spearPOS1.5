import { format } from "date-fns";
import { calcAge } from "./../helpers/utilities";
const StaffDetail = ({ staff }) => {
	return (
		<>
			<div className="row">
				<div className="col-md-7">
					<h6 className="mb-0">
						{format(new Date(staff.birthdate), "MMM dd Y")} - (
						{calcAge(staff.birthdate)} yrs)
					</h6>
					<small>Birthdate</small>
				</div>
				<div className="col-md-5">
					<h6 className="mb-0">{staff.gender}</h6>
					<small>Gender</small>
				</div>
				<div className="col-6 mt-4">
					<h6 className="mb-0">{staff.contact}</h6>
					<small>Contact</small>
				</div>

				<div className="col-12 mt-4">
					<h6 className="mb-0">{staff.email}</h6>
					<small>Email</small>
				</div>

				<div className="col-6 mt-4">
					<h6 className="mb-0">{staff.staffType}</h6>
					<small>Employment Type</small>
				</div>
				{/* <div className="col-6 mt-4">
					<h6 className="mb-0">{staff.position}</h6>
					<small>Position</small>
				</div> */}
			</div>
		</>
	);
};

export default StaffDetail;
