import React from "react";
import Component from "../component";

const UpdateClient = ({ params }: { params: { id: string } }) => {
  return <Component id={params.id} />;
};

export default UpdateClient;
