import Error from "./Error";
import Loading from "./Loading";

const CallStateHandler = ({ loading, err, errMsg }: any) => {
	if (loading) {
		return (
			<div className="flex justify-center">
				<Loading />
			</div>
		);
	} else if (err) {
		return <Error children={errMsg} />;
	} else {
		<></>;
	}
};

export default CallStateHandler;
