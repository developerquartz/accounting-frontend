import React from "react";
import Component from "../component";

const UpdateUser = ({ params }: { params: { id: string } }) => {
  return <Component id={params.id} />;
};

export default UpdateUser;
