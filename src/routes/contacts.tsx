import { A } from "@solidjs/router";
import { MainCentered } from "~/components/Main";
import { MainHeader, MediumHeader } from "~/components/Header";

export default function Contacts() {
  return (
    <MainCentered>
      <MainHeader string="Contacts Page"/>
    </MainCentered>
  );
}
