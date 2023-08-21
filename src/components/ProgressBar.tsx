import { BaseComponentParams } from "../types";

interface Params extends BaseComponentParams {
  total: number;
  current: number;
}

const ProgressBar = ({ total, current }: Params) => {
  return (
    <div className={"text-right"}>
      <p>
        {current} מיכלים הושלמו מתוך {total} שנבחרו
      </p>
    </div>
  );
};

export default ProgressBar;
