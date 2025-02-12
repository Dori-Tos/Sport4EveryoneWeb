import { A } from "@solidjs/router";
import { MainCentered } from "~/components/Main";
import Header from "~/components/Header";

export default function Contacts() {
  return (
    <MainCentered>
      <Header string="Contacts Page"/>
    </MainCentered>
  );
}
