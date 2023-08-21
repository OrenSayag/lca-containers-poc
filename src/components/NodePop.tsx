import React, { ReactNode } from "react";

const NodePop: React.FC<{
  node: ReactNode;
}> = ({ node }) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-800 outline-none focus:outline-none">
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className="my-4 text-slate-500 text-lg leading-relaxed">
                {node}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default NodePop;
