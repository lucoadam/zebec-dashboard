import LoadingSvg from "assets/images/treasury/loading.svg";

const CreatingTreasury = () => {
  return (
    <>
      <h3 className="leading-7 font-semibold text-base text-content-primary">
        Creating Treasury
      </h3>
      <p className="text-content-secondary font-normal text-sm">
        Your treasury is being created. It can take up to a minute.
      </p>
      <LoadingSvg className="w-[92px] h-[92px] mt-[32px]" />
    </>
  );
};

export default CreatingTreasury;
