import React from "react";
import Component from "../component";

const UpdateClient = ({ params }: { params: { clientOp: string } }) => {
  return <Component clientOp={params.clientOp} />;
};

export default UpdateClient;
