import MoonLoader from "react-spinners/BarLoader";

const override = {
    display: "block",
};

const Spinner = ({ loading, }: any) => {
    return (
        <MoonLoader
            color="#4b5563"
            loading={loading}
            cssOverride={override}
            width={300}
        />
    );
};
export default Spinner;