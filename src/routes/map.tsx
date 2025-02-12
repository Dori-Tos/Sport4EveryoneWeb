import { A } from "@solidjs/router";
import { MainCentered } from "~/components/Main";
import { MainHeader, MediumHeader } from "~/components/Header";

export default function Map() {
  return (
    <MainCentered>
        <MainHeader string="Map Page"/>
    </MainCentered>
  );
}
