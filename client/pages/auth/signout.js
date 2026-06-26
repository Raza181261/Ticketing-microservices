import { useEffect } from "react";
import Router from "next/router";
import useRequest  from "../../hooks/use-request";

export default () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div className="fifa-page text-center fifa-title fifa-gradient-text display-5">Signing you out...</div>;
}